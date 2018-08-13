import { observable, action, computed } from 'mobx'
import MainStore from '../../AppStores/MainStore'
import Wallet from '../../AppStores/stores/Wallet'
import NavStore from '../../stores/NavStore'

class CreateWalletStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable finished = false
  @observable loading = false

  @action setTitle(title) {
    this.customTitle = title
  }

  @action handleCreateWallet() {
    this.loading = true
    const ds = MainStore.secureStorage
    const index = MainStore.appState.currentWalletIndex
    const { title } = this
    Wallet.generateNew(ds, title, index).then(async (w) => {
      this.finished = true
      await w.save()
      await MainStore.appState.syncWallets()
      MainStore.appState.autoSetSelectedWallet()
      MainStore.appState.setCurrentWalletIndex(index + 1)
      MainStore.appState.save()
      this.loading = false
      NavStore.reset()
    }, ds)
  }

  @computed get title() {
    return this.customTitle
  }

  // {'{title}': 1}
  @computed get titleMap() {
    const { wallets } = MainStore.appState
    return wallets.reduce((rs, w) => {
      const result = rs
      result[w.title] = 1
      return result
    }, {})
  }

  @computed get isShowError() {
    const title = this.customTitle
    return !this.finished && this.titleMap[title]
  }
}

export default CreateWalletStore
