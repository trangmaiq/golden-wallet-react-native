import { AsyncStorage } from 'react-native'
import Starypto from '../../../Libs/react-native-starypto'

// Use for unlocking wallet with private key
// Data stored: cipher
// Encryption: DES

const dataKey = (address) => `${address}-privateKey`.toLowerCase()
const trackDataKey = 'address-privatekey-added'

class SecurePrivateKeyDataSource {
  password = ''
  iv = ''

  constructor(password, iv) {
    this.password = password
    this.iv = iv
  }

  updateTrackDataKey = async (address, deleting = false) => {
    const keysStr = await AsyncStorage.getItem(trackDataKey)
    const keysObj = keysStr ? JSON.parse(keysStr) : {}
    if (deleting) keysObj[address] = 1
    else delete (keysObj[address])

    await AsyncStorage.setItem(trackDataKey, JSON.stringify(keysObj))
  }

  async getPrivateKey(address) {
    const privateKeyCipher = await AsyncStorage.getItem(dataKey(address))
    if (!privateKeyCipher) return null
    return Starypto.decryptString(privateKeyCipher, this.password, this.iv, 'aes-256-cbc')
  }

  savePrivateKey(address, privateKey) {
    const cipher = Starypto.encryptString(privateKey, this.password, this.iv, 'aes-256-cbc')
    this.updateTrackDataKey(address, false)
    return AsyncStorage.setItem(dataKey(address), cipher)
  }

  deletePrivateKey(address) {
    this.updateTrackDataKey(address, true)
    return AsyncStorage.removeItem(dataKey(address))
  }

  clearAllData = async () => {
    const keysStr = await AsyncStorage.getItem(trackDataKey)
    const keysObj = keysStr ? JSON.parse(keysStr) : {}

    Object.keys(keysObj).forEach(k => AsyncStorage.removeItem(dataKey(address)))
    await AsyncStorage.removeItem(trackDataKey)
  }
}

export default SecurePrivateKeyDataSource