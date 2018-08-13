import { observable, action } from 'mobx'
import SendStore from '../modules/SendTransaction/stores/SendStore'
import SecureDS from './DataSource/SecureDS'
import AppDS from './DataSource/AppDS'
import appState from './AppState'
import UnlockStore from '../modules/Unlock/UnlockStore'
import ImportStore from '../modules/WalletImport/stores/ImportStore'
import BackupStore from '../modules/WalletBackup/BackupStore'
import AddressBookStore from '../modules/AddressBook/AddressBookStore'

// do not allow change state outside action function
// configure({ enforceActions: true })

// const pincode = `111111` // for test

class MainStore {
  @observable appState = appState
  secureStorage = null
  sendTransaction = null
  unlock = null
  importStore = null
  backupStore = null
  addressBookStore = null

  setSecureStorage(pincode) {
    this.secureStorage = new SecureDS(pincode)
  }

  // Start
  @action async startApp() {
    await AppDS.readAppData()
  }

  goToSendTx() {
    this.sendTransaction = new SendStore()
  }

  gotoUnlock() {
    this.unlock = new UnlockStore()
    const unlockDes = this.appState.hasPassword ? 'Unlock with your PIN' : 'Create your PIN'
    this.unlock.setData({
      unlockDes
    })
  }

  gotoImport() {
    this.importStore = new ImportStore()
  }

  async gotoBackup() {
    this.backupStore = new BackupStore()
    const mnemonic = await this.secureStorage.deriveMnemonic()
    this.backupStore.setMnemonic(mnemonic)
  }

  gotoAddressBook() {
    this.addressBookStore = new AddressBookStore()
  }
}

export default new MainStore()
