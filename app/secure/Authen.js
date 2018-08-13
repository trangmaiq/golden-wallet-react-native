import * as Keychain from 'react-native-keychain'
import { randomBytes } from 'react-native-randombytes'
import localStorage from './LocalStorage'
import KeyLocal from './../commons/SAVED_ID_LOCAL'
import Starypto from './../../Libs/react-native-starypto'
import WalletStore from '../stores/WalletStore'
import NavStore from '../stores/NavStore'

class Authen {
  randomKey = ''
  isCreated = false
  iv = null

  setup = async () => {
    this.isCreated = await this.isCreatedPinCode()
    // Keychain.resetGenericPassword()
  }

  isCreatedPinCode = async () => {
    const havePin = await localStorage.getItem(KeyLocal.PIN_CODE)
    if (havePin) {
      if (havePin.length > 4) {
        // localStorage.saveItem(KeyLocal.PIN_CODE, 'true')
        NavStore.popupCustom.show('Golden Wallet need to setup a new Pin Code.')
        return false
      }
      return true
    }
    Keychain.resetGenericPassword()
    return false
  }

  savePin = () => {
    localStorage.saveItem(KeyLocal.PIN_CODE, 'true')
  }

  saveIV = (iv) => {
    localStorage.saveItem(KeyLocal.IV_CODE, iv)
  }

  initIVIfNeeded = async () => {
    let iv = await localStorage.getItem(KeyLocal.IV_CODE)
    if (!iv) {
      iv = randomBytes(16).toString('hex').slice(0, 16)
      this.saveIV(iv)
    }
    this.iv = iv
  }

  getRandomKeyFromKeychain = async (pinCode, iv) => {
    const credentials = await Keychain.getGenericPassword()
    if (!(credentials && credentials.username)) {
      const randomStr = randomBytes(16).toString('hex').slice(0, 16)
      const randomStrEncrypted = Starypto.encryptString(randomStr, pinCode, iv, 'aes-256-cbc')
      Keychain.setGenericPassword(KeyLocal.IV_CODE, randomStrEncrypted)
      return randomStrEncrypted
    }
    let randomKey = credentials.password
    if (randomKey.length === 16) {
      randomKey = Starypto.encryptString(randomKey, pinCode, iv, 'aes-256-cbc')
      Keychain.setGenericPassword(KeyLocal.IV_CODE, randomKey)
    }
    return randomKey
  }

  getDataEncrypFromStorage = async () => {
    const dataEncrypted = await localStorage.getItem(KeyLocal.DATA_ENCRYPTED)
    return dataEncrypted
  }

  getDecryptedRandomKey = async (pinCode, iv) => {
    const dataEncrypted = await this.getRandomKeyFromKeychain(pinCode, iv)
    const dataDecrypted = Starypto.decryptString(dataEncrypted, pinCode, iv, 'aes-256-cbc')
    this.randomKey = dataDecrypted
    return dataDecrypted
  }

  decrypData = (pinCode, iv, shouldLoadData = true) => {
    return new Promise(async (resolve, reject) => {
      try {
        const randomKeyDecrypted = await this.getDecryptedRandomKey(pinCode, iv)
        const dataEncryptedFromStorage = await this.getDataEncrypFromStorage()
        if (!dataEncryptedFromStorage) {
          return resolve()
        }
        const dataDecrypted = Starypto.decryptString(dataEncryptedFromStorage, randomKeyDecrypted, iv, 'aes-256-cbc')
        if (shouldLoadData) {
          WalletStore.fetchUserWallet(dataDecrypted)
        }
        return resolve(dataDecrypted)
      } catch (e) {
        console.log(e)
        return reject(e)
      }
    })
  }
}

const authen = new Authen()
export default authen
