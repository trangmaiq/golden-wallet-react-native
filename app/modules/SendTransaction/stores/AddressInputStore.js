import { observable, computed, action } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Checker from '../../../Handler/Checker'

export default class AddressInputStore {
  @observable.ref amount = 0
  @observable.ref amountUSD = 0
  @observable.ref type = 'ETH'
  @observable address = ''
  @observable.ref addressModal = null
  @observable.ref qrCodeModal = null
  @observable.ref confirmModal = null

  // constructor({ setToAddress }) {
  //   this.setToAddress = setToAddress
  // }
  @observable disableSend = true

  @computed get selectedToken() {
    return MainStore.appState.selectedToken
  }

  @action setAddress(address) {
    this.address = address
  }

  @action setAddressFromQrCode(result) {

  }

  @action setDisableSend(bool) {
    this.disableSend = bool
  }

  @action validateAddress() {
    this.disableSend = !Checker.checkAddress(this.address)
  }

  @action setAmount(amount) {
    this.amount = amount
  }

  @computed get amountFormated() {
    if (this.type === 'ETH') {
      return `${this.amount} ETH`
    }
    return `$${this.amountUSD}`
  }

  onConfirm() {
    // this.setToAddress(this.address)
  }
}
