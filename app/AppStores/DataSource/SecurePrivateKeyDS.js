import { AsyncStorage } from 'react-native'


// Use for unlocking wallet with private key
// Data stored: cipher
// Encryption: DES

const dataKey = (address) => `${address}-privateKey`

class SecurePrivateKeyDataSource {

  async getPrivateKey(address) {
    const privateKeyCipher = await AsyncStorage.getItem(dataKey(address))
    if (!privateKeyCipher) return null

    // Decrypt key and return
    return ''
  }

  async getWalletAtAddress(address) {
    const wallets = this.wallets || await this.getWallets()
    return wallets.find(w => w.address == address)
  }

  savePrivateKey(address, privateKey) {
    // Encrypt and store
    return AsyncStorage.setItem(dataKey(address), privateKey)
  }

  deletePrivateKey(address) {
    return AsyncStorage.removeItem(dataKey(address))
  }
}

export default new SecurePrivateKeyDataSource()