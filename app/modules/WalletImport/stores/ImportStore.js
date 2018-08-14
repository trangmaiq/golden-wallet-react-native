import ImportAddressStore from './ImportAddressStore'
import ImportPrivateKeyStore from './ImportPrivateKeyStore'
import ImportMnemonicStore from './ImportMnemonicStore'

export default class ImportStore {
  importAddressStore = null
  importPrivateKeyStore = null
  importMnemonicStore = null

  constructor() {
    this.importAddressStore = new ImportAddressStore()
    this.importPrivateKeyStore = new ImportPrivateKeyStore()
    this.importMnemonicStore = new ImportMnemonicStore()
  }
}
