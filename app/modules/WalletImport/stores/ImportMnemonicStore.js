import { observable, action, computed } from 'mobx'
import MainStore from '../../../AppStores/MainStore'
import Wallet from '../../../AppStores/stores/Wallet'
import NavStore from '../../../stores/NavStore'

export default class ImportMnemonicStore {
  @observable customTitle = `My wallet ${MainStore.appState.wallets.length}`
  @observable mnemonicPhrase = ''
  @observable mnemonicWallets = []
  @observable loading = false
  @observable selectedWallet = null

  @action setTitle = (title) => { this.customTitle = title }
  @action setMnemonic = (mn) => { this.mnemonicPhrase = mn }
  @action setSelectedWallet = (w) => { this.selectedWallet = w }

  @computed get title() {
    return this.customTitle
  }

  @action async generateWallets() {
    this.loading = true
    const title = `My wallet ${MainStore.appState.wallets.length}`
    const ds = MainStore.secureStorage
    const mnemonicWallets = []
    for (let i = 0; i < 5; i++) {
      /* eslint-disable-next-line */
      const wallet = await Wallet.importMnemonic(this.mnemonic, title, i, ds)
      mnemonicWallets.push(wallet)
    }
    this.loading = false
    this.mnemonicWallets = mnemonicWallets
    return mnemonicWallets
  }

  @action async unlockWallet() {
    if (!this.selectedWallet) {
      NavStore.popupCustom.show('No wallet have not selected')
    }
    await this.selectedWallet.save()
    await MainStore.appState.syncWallets()
    MainStore.appState.autoSetSelectedWallet()
    NavStore.reset()
  }

  @computed get isLoading() {
    return this.loading
  }

  @computed get mnemonic() {
    return this.mnemonicPhrase
  }
}
