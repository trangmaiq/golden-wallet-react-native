import { AsyncStorage } from 'react-native'
import Wallet from '../Stores/Wallet'

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
    return wallets.find(w => w.address == address)
  }

  saveWallets(arrayData) {
    return AsyncStorage.setItem(dataKey, JSON.stringify(arrayData))
  }

  async addNewWallet(wallet) {
    const wallets = await this.getWallets()
    wallets.push(wallet)
    return this.saveWallets(wallets)
  }

  async deleteWallet(address) {
    const wallets = await this.getWallets()
    const result = wallets.filter(w => w.address != address)
    return this.saveWallets(result)
  }
}

export default new WalletDataSource()