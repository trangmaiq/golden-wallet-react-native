import KeyStore from './Libs/react-native-golden-keystore'

const mnemonicIsValid = (str) => KeyStore.mnemonicIsValid(str)
  .then(isValid => console.log(isValid))

const generateMnemonic = () => KeyStore.generateMnemonic()
  .then(mnemonic => console.log(mnemonic))

const createHDKeyPair = (
  mnemonic = 'vibrant dinner choose observe deny mammal snow rule twin yellow swear ketchup',
  passphrase = '',
  path = KeyStore.CoinType.ETH.path, // `m/44'/60'/0'/0/index`
  index = 0
) => KeyStore.createHDKeyPair(mnemonic, passphrase, path, index)
  .then(({ private_key, public_key }) => console.log({ private_key, public_key }))

const createHDKeyPairs = (
  mnemonic = 'vibrant dinner choose observe deny mammal snow rule twin yellow swear ketchup',
  passphrase = '',
  path = KeyStore.CoinType.ETH.path, // `m/44'/60'/0'/0/index`
  from = 0,
  to = 49
) => KeyStore.createHDKeyPairs(mnemonic, passphrase, path, from, to)
  .then(keys => console.log(keys))

export default {
  mnemonicIsValid,
  generateMnemonic,
  createHDKeyPair,
  createHDKeyPairs
}