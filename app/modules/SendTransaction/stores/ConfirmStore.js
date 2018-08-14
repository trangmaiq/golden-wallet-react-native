import { observable, action, computed } from 'mobx'
import { BigNumber } from 'bignumber.js'
import MainStore from '../../../AppStores/MainStore'
import Helper from '../../../commons/Helper'

export default class ConfirmStore {
  @observable value = new BigNumber('0')
  @observable gasLimit = new BigNumber('21000')
  @observable gasPrice = new BigNumber('1000000000')

  @observable.ref inputValue = null

  // @action setToAddress(address) {
  //   this.transaction.to = address
  // }

  @action setValue(value) {
    this.inputValue = value
    this.value = value
  }

  @action updateValue(value) {
    this.value = value
  }

  @action setGasLimit(gasLimit) {
    this.gasLimit = new BigNumber(`${gasLimit}`)
  }

  @action setGasPrice(gasPrice) {
    // const gasP = new BigNumber(Starypto.Units.parseUnits(`${gasPrice}`, 9)._bn.toString(10))
    const gasP = new BigNumber(gasPrice).times(new BigNumber(1e+9))
    this.gasPrice = gasP
  }

  @action estimateGas() {
    if (MainStore.sendTransaction.isToken) {
      this.gasLimit = new BigNumber(150000)
    } else {
      this.gasLimit = new BigNumber(21000)
    }
  }

  @computed get rate() {
    return MainStore.appState.rateETHDollar
  }

  @computed get rateToken() {
    return MainStore.appState.selectedToken.rate
  }

  @computed get title() {
    return MainStore.sendTransaction.isToken ? MainStore.appState.selectedToken.symbol : 'ETH'
  }

  @computed get formatedFee() {
    // const fee = Starypto.Units.formatUnits(`${this.gasLimit.times(this.gasPrice)}`, 18)
    const fee = this.gasLimit.times(this.gasPrice).div(new BigNumber(1e+18))
    return `${fee} ETH ($${Helper.formatUSD(Number(fee) * this.rate)})`
  }

  @computed get formatedAmount() {
    Helper.formatETH()
    return `${Helper.formatETH(this.value)} ${this.title}`
  }

  @computed get formatedDolar() {
    // TODO getRate
    const rate = MainStore.sendTransaction.isToken ? this.rateToken : this.rate
    const amountDolar = this.value.times(rate)
    return `$${Helper.formatUSD(amountDolar)}`
  }
  _onShowAdvance() {
    // const formatedGasPrice = Number(Starypto.Units.formatUnits(`${this.gasPrice}`, 9)).toFixed(0)
    const formatedGasPrice = this.gasPrice.div(1e+9).toFixed(0)

    MainStore.sendTransaction.advanceStore.setGasLimit(this.gasLimit.toString(10))
    MainStore.sendTransaction.advanceStore.setGasPrice(formatedGasPrice)
  }
  @action validateAmount() {
    const { selectedWallet } = MainStore.appState
    const { balance } = selectedWallet
    const { gasLimit, gasPrice } = this

    const balanceBN = balance.div(new BigNumber(1e+9))
    const gasPriceBN = gasPrice
    const gasLimitBN = gasLimit

    const gasBN = gasLimitBN.times(gasPriceBN).div(new BigNumber('1000000000'))
    let maxBN = balanceBN.minus(gasBN)
    maxBN = maxBN.div(1e+9)
    // console.log(maxBN.toNumber(), gasBN.toNumber(), maxBN.div(1e+9).toNumber())

    if (this.title !== 'ETH') return maxBN.gte(new BigNumber('0')) // token

    if (maxBN.lt(new BigNumber('0'))) {
      this.updateValue(new BigNumber('0'))
      return false
    }
    if (this.inputValue.gt(maxBN)) {
      this.updateValue(maxBN)
    } else {
      this.updateValue(this.inputValue)
    }
    return true
  }
}
