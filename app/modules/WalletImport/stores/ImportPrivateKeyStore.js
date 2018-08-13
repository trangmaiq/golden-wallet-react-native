import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'

export default class ImportPrivateKeyStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable privKey = ''

  @action setTitle = (title) => { this.customTitle = title }
  @action setPrivateKey = (pk) => { this.privKey = pk }

  @computed get title() {
    return this.customTitle
  }

  @action async create() {
    const ds = MainStore.secureStorage
    const w = Wallet.importPrivateKey(this.privateKey, this.title, ds)
    await w.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    NavStore.reset()
  }

  @computed get privateKey() {
    return this.privKey
  }
}
