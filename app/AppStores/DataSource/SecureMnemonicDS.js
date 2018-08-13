import { AsyncStorage } from 'react-native'
import Keystore from '../../../Libs/react-native-golden-keystore'
import Starypto from '../../../Libs/react-native-starypto'

const dataKey = `secure-mnemonic`

class SecureMnemonicDS {
  password = ''
  iv = ''

  constructor(password, iv) {
    this.password = password
    this.iv = iv
  }

  generateNew = () => Keystore.generateMnemonic()


  derive = async () => {
    const mnemonicCipher = await AsyncStorage.getItem(dataKey)
    if (!mnemonicCipher) return await this._deriveNew()

    return await this._deriveOld(mnemonicCipher)
  }

  remove = () => AsyncStorage.removeItem(dataKey)

  _deriveNew = async () => {
    const mnemonic = await this.generateNew()
    const mnemonicCipher = Starypto.encryptString(mnemonic, this.password, this.iv, 'aes-256-cbc')
    await AsyncStorage.setItem(dataKey, mnemonicCipher)

    return mnemonic
  }

  _deriveOld = async (mnemonicCipher) => {
    return Starypto.decryptString(mnemonicCipher, this.password, this.iv, 'aes-256-cbc')
  }
}

export default SecureMnemonicDS