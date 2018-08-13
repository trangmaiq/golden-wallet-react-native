import { AsyncStorage } from 'react-native'
import Wallet from '../stores/Wallet'
import MainStore from '../MainStore'

const dataKey = 'WALLETS_STORAGE'

class WalletDataSource {
  wallets = [] // for caching

  async getWallets() {
    const walletsStr = await AsyncStorage.getItem(dataKey)
    if (!walletsStr) return []

    this.wallets = JSON.parse(walletsStr).map(js => new Wallet(js))
    return this.wallets
  }

  async getWalletAtAddress(address) {
    const wallets = this.wallets || await this.getWallets()
    return wallets.find(w => w.address === address)
  }

  async getIndexAtAddress(address) {
    const wallets = this.wallets || await this.getWallets()
    const wallet = await this.getWalletAtAddress(address)
    return wallets.indexOf(wallet)
  }

  saveWallets(walletsArray) {
    const walelts = walletsArray.map(w => w.toJSON())
    return AsyncStorage.setItem(dataKey, JSON.stringify(walelts))
  }

  async updateWallet(wallet) {
    const wallets = await this.getWallets()

    for (let i = 0; i < wallets.length; i++) {
      if (wallets[i].address === wallet.address) {
        wallets[i] = wallet
        this.saveWallets(wallets)
        break
      }
    }
  }

  async addNewWallet(wallet) {
    const wallets = await this.getWallets()
    const find = wallets.find(w => w.address === wallet.address)
    if (!find) wallets.push(wallet)
    return this.saveWallets(wallets)
  }

  async deleteWallet(address) {
    const wallets = await this.getWallets()
    const index = await this.getIndexAtAddress(address)
    const result = wallets.filter(w => w.address != address)
    MainStore.secureStorage.removePrivateKey(address)
    if (index === wallets.length - 1) {
      MainStore.appState.setSelectedWallet(null)
    }
    return this.saveWallets(result)
  }
}

export default new WalletDataSource()
