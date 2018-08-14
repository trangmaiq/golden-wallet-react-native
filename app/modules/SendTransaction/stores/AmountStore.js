import { observable, action, computed, toJS } from 'mobx'
import HapticHandler from '../../../Handler/HapticHandler'
import Helper from '../../../commons/Helper'
import MainStore from '../../../AppStores/MainStore'
import { BigNumber } from 'bignumber.js'

class AmountStore {
  @observable amountText = {
    data: [],
    subData: [],
    isUSD: false,
    isHadPoint: false
  }

  prefix = '$'
  selectedCoinModal = ''

  @computed get amountCrypto() {
    const { selectedWallet, selectedToken } = MainStore.appState
    return MainStore.sendTransaction.isToken
      ? (selectedToken.balance.dividedBy(new BigNumber(`1.0e+${selectedToken.decimals}`)))
      : (selectedWallet.balance.dividedBy(new BigNumber('1.0e+18'))) // Big Num
  }

  @computed get rate() {
    const { selectedToken } = MainStore.appState
    return MainStore.sendTransaction.isToken ? selectedToken.rate : MainStore.appState.rateETHDollar // Big Num
  }

  @computed get postfix() {
    const { selectedToken } = MainStore.appState
    return MainStore.sendTransaction.isToken ? selectedToken.symbol : 'ETH' // String
  }

  @computed get walletName() {
    const { selectedWallet } = MainStore.appState
    return selectedWallet.title // String
  }

  @computed get amountUSD() {
    const { selectedWallet, selectedToken } = MainStore.appState
    return MainStore.sendTransaction.isToken ? selectedToken.balanceInDollar : selectedWallet.totalBalanceDollar // Big num
  }

  @computed get amountTextBigNum() {
    return new BigNumber(this.amountTextString) // Big num
  }

  @computed get amountSubTextBigNum() {
    const { isUSD } = this.amountText
    return isUSD
      ? (this.rate.isZero() ? new BigNumber(0) : this.amountTextBigNum.dividedBy(this.rate))
      : this.amountTextBigNum.multipliedBy(this.rate)
  }

  @computed get valueBigNum() {
    const { isUSD } = this.amountText
    return isUSD ? this.amountSubTextBigNum : this.amountTextBigNum
  }

  @computed get amountTextString() {
    const array = this.amountText.data.map((item) => { return item.text })
    return array.join('').replace(/,/g, '') || '0' // String
  }

  @computed get amountCryptoString() {
    return this.amountCrypto.toString(10) // String
  }

  @computed get amountUSDString() {
    return this.amountUSD.toString(10) // String
  }

  @computed get amountHeaderString() {
    const { isUSD } = this.amountText
    return isUSD
      ? `${this.prefix}${Helper.formatUSD(this.amountUSDString, true)}`
      : `${Helper.formatETH(this.amountCryptoString, true)} ${this.postfix}`
  }

  @computed get amountHeaderAddressInputScreen() {
    const { isUSD } = this.amountText
    return isUSD
      ? `${this.prefix}${Helper.formatUSD(this.amountTextString, true)}`
      : `${Helper.formatETH(this.amountTextString, true)} ${this.postfix}`
  }

  @computed get amountSubTextString() {
    const { isUSD } = this.amountText
    return isUSD
      ? `${Helper.formatETH(this.amountSubTextBigNum.toString(10), true)} ${this.postfix}`
      : `${this.prefix}${Helper.formatUSD(this.amountSubTextBigNum.toString(10), true)}`
  }

  @computed get checkInputValid() {
    return this.amountText.data.length != 0 && this.checkMaxBalanceValid
  }

  @computed get checkMaxBalanceValid() {
    return (this.amountText.isUSD
      ? this.amountTextBigNum.isLessThanOrEqualTo(this.amountUSD)
      : this.amountTextBigNum.isLessThanOrEqualTo(this.amountCrypto))
  }

  @computed get checkSmallSize() {
    const {
      data,
      isUSD,
      isHadPoint,
      subData
    } = this.amountText
    const newSubData = subData.map((item) => { return item.text != '' })
    return isUSD
      ? (isHadPoint ? data.length + newSubData.length > 9 : data.length > 9)
      : (isHadPoint ? data.length + newSubData.length > 6 : data.length > 6)
  }

  @computed get getAmountText() {
    return toJS(this.amountText) // object
  }

  @action setSelectedCoinModal(ref) {
    this.selectedCoinModal = ref
  }

  @action toggle() {
    this.amountText = {
      data: [],
      subData: [],
      isUSD: !this.amountText.isUSD,
      isHadPoint: false
    }
    HapticHandler.ImpactLight()
  }

  @action setAmountText(object) {
    this.amountText = {
      ...this.amountText,
      ...object
    }
  }

  @action send() {
    MainStore.sendTransaction.confirmStore.setValue(this.valueBigNum)
  }

  @action max() {
    const { isUSD } = this.amountText
    const value = isUSD ? Helper.formatUSD(this.amountUSDString, true, 100000000) : Helper.formatETH(this.amountCryptoString, true)
    const dataSplit = value.toString().split('.')
    const integer = dataSplit[0]
    const decimal = dataSplit[1] ? dataSplit[1] : ''
    if (decimal.split('').length == 0) {
      const data = Helper.numberWithCommas(integer).split('').map((item) => { return { text: item } })
      this.setAmountText({ data, subData: [], isHadPoint: false })
    } else if (decimal.split('').length == 1) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = isUSD ? [{ text: '0' }] : [{ text: '0' }, { text: '' }, { text: '' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 2) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = isUSD ? [] : [{ text: '0' }, { text: '' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 3) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      const subData = [{ text: '0' }]
      this.setAmountText({ data, subData, isHadPoint: true })
    } else if (decimal.split('').length == 4) {
      const string = `${Helper.numberWithCommas(integer)}.${decimal}`
      const data = string.split('').map((item) => { return { text: item } })
      this.setAmountText({ data, subData: [], isHadPoint: true })
    }
    HapticHandler.ImpactLight()
  }

  @action add(item) {
    const {
      data,
      subData,
      isUSD,
      isHadPoint
    } = this.amountText
    if (data.length == (isUSD ? 9 : 6) && item.text !== '.' && !isHadPoint) return
    else if (data.length == 0 && item.text == '.') {
      const newData = [{ text: '0' }, item]
      const newSubData = isUSD ? [{ text: '0' }, { text: '' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }]
      this.setAmountText({ data: newData, subData: newSubData, isHadPoint: true })
      return
    } else if (data.length == 1 && item.text !== '.' && data[0].text == '0') {
      data.pop()
      data.push(item)
      this.setAmountText({ data, isHadPoint: false })
      return
    } else if (isHadPoint && item.text === '.') return
    else if (subData.length > 0) {
      data.push(item)
      subData.pop()
      this.setAmountText({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) return
    const zeroAfterPoint = item.text === '.' ? (isUSD ? [{ text: '0' }, { text: '' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }]) : []
    if (data.length == 3 && item.text !== '.') data.splice(1, 0, { text: ',' })
    else if (data.length == 5 && item.text !== '.') {
      data.splice(1, 1)
      data.splice(2, 0, { text: ',' })
    } else if (data.length == 6 && item.text !== '.') {
      data.splice(2, 1)
      data.splice(3, 0, { text: ',' })
    } else if (data.length == 7 && item.text !== '.') {
      data.splice(3, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    }
    this.setAmountText({ data: [...data, item], subData: zeroAfterPoint, isHadPoint: item.text === '.' ? true : isHadPoint })
  }

  @action clearAll() {
    this.setAmountText({ data: [], subData: [], isHadPoint: false })
  }

  @action remove() {
    const {
      data,
      subData,
      isUSD,
      isHadPoint
    } = this.amountText
    if (subData.length == (isUSD ? 2 : 4)) {
      data.pop()
      this.setAmountText({ data, subData: [], isHadPoint: false })
      return
    } else if (subData.length > 0) {
      data.pop()
      subData.push({ text: '' })
      this.setAmountText({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) {
      const item = data.pop()
      subData.push({ text: '0' })
      this.setAmountText({ data, subData, isHadPoint: item.text === '.' ? false : isHadPoint })
      return
    } else if (data.length == 0) return
    const item = data.pop()
    if (data.length == 4) data.splice(1, 1)
    else if (data.length == 5) {
      data.splice(2, 1)
      data.splice(1, 0, { text: ',' })
    } else if (data.length == 6) {
      data.splice(3, 1)
      data.splice(2, 0, { text: ',' })
    } else if (data.length == 8) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(3, 0, { text: ',' })
    } else if (data.length == 9) {
      data.splice(2, 1)
      data.splice(5, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.length == 10) {
      data.splice(3, 1)
      data.splice(6, 1)
      data.splice(2, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.lenth == 12) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(7, 1)
      data.splice(3, 0, { text: ',' })
      data.splice(7, 0, { text: ',' })
    }
    // dataRef[`${data.length}`] && dataRef[`${data.length}`].removeAnimation()
    this.setAmountText({ data, isHadPoint: item.text === '.' ? false : isHadPoint })
  }
}

export default AmountStore
