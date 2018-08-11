import { observable, action } from 'mobx'
import { AsyncStorage, Platform } from 'react-native'
import { randomBytes } from 'react-native-randombytes'
import * as Keychain from 'react-native-keychain'
import TouchID from '../../Libs/react-native-touch-id'

class ObservableAuthenStore {
  @observable.ref pinHash = null
  @observable.ref iv = null
  @observable.ref isCreatePass = false
  @observable.ref randomCode = null
  @observable.ref biometryType = null

  @action setIsCreatePass(isCreate) {
    this.isCreatePass = isCreate
  }

  @action savePinHash(pin) {
    this.pinHash = pin
    return AsyncStorage.setItem('PIN_CODE', pin)
  }

  @action getPinHash() {
    return new Promise(async (resolve, reject) => {
      try {
        const pinHash = await AsyncStorage.getItem('PIN_CODE')
        if (pinHash === null) {
          return resolve(null)
        }
        this.pinHash = pinHash
        return resolve(pinHash)
      } catch (err) {
        return reject(err)
      }
    })
  }

  @action saveIV(iv) {
    this.iv = iv
    return AsyncStorage.setItem('IV', iv)
  }

  @action getIV() {
    return new Promise(async (resolve, reject) => {
      try {
        const iv = await AsyncStorage.getItem('IV')
        if (iv === null) {
          return resolve(null)
        }
        this.iv = iv
        return resolve(iv)
      } catch (err) {
        return reject(err)
      }
    })
  }

  @action async initIVIfNeeded() {
    let iv = await AsyncStorage.getItem('IV')
    if (!iv) {
      iv = randomBytes(16).toString('hex').slice(0, 16)
    }
    this.saveIV(iv)
  }

  @action async setupRandomCodeKeychain() {
    const credentials = await Keychain.getGenericPassword()
    if (!credentials) {
      const randomStr = randomBytes(16).toString('hex').slice(0, 16)
      Keychain.setGenericPassword('IV', randomStr)
      return randomStr
    }
    return credentials.password
  }

  @action async setupBiometricType() {
    if (Platform.OS === 'android') {
      this.biometryType = 'Touch ID'
      return
    }
    try {
      const biometryType = await TouchID.isSupported()
      this.biometryType = biometryType
    } catch (e) {
      this.biometryType = ''
    }
  }
}

const AuthenStore = new ObservableAuthenStore()
export default AuthenStore
