import { observable, action } from 'mobx'
import AddressBook from '../../AppStores/stores/AddressBook'
import MainStore from '../../AppStores/MainStore'
import Checker from '../../Handler/Checker'
import NavStore from '../../stores/NavStore'

export default class AddressBookStore {
  @observable title = ''
  @observable address = ''

  @action setTitle = (t) => { this.title = t }
  @action setAddress = (add) => { this.address = add }

  @action async saveAddressBook() {
    const validate = Checker.checkAddress(this.address)
    if (!validate) {
      NavStore.popupCustom.show('Invalid Address')
      return
    }
    const ab = AddressBook.createNew(this.title, this.address)
    await ab.save()
    MainStore.appState.syncAddressBooks()
    NavStore.goBack()
  }
}
