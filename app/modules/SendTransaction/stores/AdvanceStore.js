import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Starypto from '../../../../Libs/react-native-starypto'

export default class AdvanceStore {
  @observable gasLimit = ''
  @observable gasPrice = ''
  @observable isShowClearGasLimit = false
  @observable isShowClearGasPrice = false
  @observable gasLimitErr = ''
  @observable gasGweiErr = ''
  @observable isDisableDone = false

  @action setGasLimit(gasLimit) {
    this.gasLimit = gasLimit
  }
  @action setGasPrice(gasPrice) {
    this.gasPrice = gasPrice
  }
  @action setGasLimitErr(err) {
    this.gasLimitErr = err
  }
  @action setGasPriceErr(err) {
    this.gasGweiErr = err
  }
  @action setDisableDone(bool) {
    this.isDisableDone = bool
  }
  @action validate() {

  }

  @computed get rate() {
    return 421
  }

  @computed get title() {
    return 'ETH'
  }

  _onDone() {
    MainStore.sendTransaction.confirmStore.setGasLimit(this.gasLimit)
    MainStore.sendTransaction.confirmStore.setGasPrice(this.gasPrice)
    MainStore.sendTransaction.confirmStore.validateAmount()
  }

  @computed get formatedTmpFee() {
    const gasLimit = Number(Starypto.Units.formatUnits(`${this.gasLimit}`, 9))
    const gasPrice = Number(this.gasPrice)
    const fee = gasLimit * gasPrice
    return `${fee} ${this.title} ($${fee * this.rate})`
  }
}
