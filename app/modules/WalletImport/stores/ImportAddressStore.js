import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'

export default class ImportAddressStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable addessWallet = ''

  @action setTitle(title) {
    this.customTitle = title
  }

  @action setAddress(address) {
    this.addessWallet = address
  }

  @action async create(title) {
    this.loading = true
    const ds = MainStore.secureStorage
    const { address } = this
    const w = Wallet.importAddress(address, title, ds)
    await w.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    NavStore.reset()
  }

  @computed get title() {
    return this.customTitle
  }

  @computed get address() {
    return this.addessWallet
  }
}
