import wif from 'wif'
import bip39 from 'react-native-bip39'
import BigInteger from 'bigi'
import ECPair from './ecpair'
import HDNode from './hdnode'
import networks from './networks'
import keyHashes from './key-hashes'
import coinTypes from './coinTypes'
import Wallet from './wallet'
import Providers from './providers'
import Units from './ether-utils/units'
import dataEncrypt from './dataEncrypt'

const Contract = require('./ether-utils/contract')
const bitcoin = require('./networks/bitcoin')

const generateMnemonic = async () => {
  const mnemonic = await bip39.generateMnemonic()
  return fromMnemonic(mnemonic)
}

const makeRandom = (coinType = coinTypes.ETH, network = 'mainnet', opts = {}) => {
  const newECPair = ECPair.makeRandom({ coinType, network, ...opts })
  return new Wallet({ coinType: coinType.name, network, ...opts }, newECPair)
}

const fromMnemonic = (mnemonic, passpharse) => {
  const seedBuffer = bip39.mnemonicToSeed(mnemonic, passpharse)
  const node = HDNode.fromSeedBuffer(seedBuffer)
  node.mnemonic = mnemonic
  return node
} // import old

const fromHDNode = (node, coinType = coinTypes.ETH, network = 'mainnet') => {
  const ct = node.coinType || coinType
  return new Wallet({ coinType: ct.name, network }, node.keyPair)
}

const fromPrivateKey = (privateKey, coinType = coinTypes.ETH, network = 'mainnet') => {
  if (typeof privateKey !== 'string') throw new Error('Invalid Private Key')
  if (privateKey.includes('0x')) privateKey = privateKey.slice(2)

  const d = BigInteger.fromHex(privateKey)
  const newECPair = new ECPair(d, null, { coinType, network })
  return new Wallet({ coinType: coinType.name, network }, newECPair)
}  // return wallet

const fromPublicKey = (publicKey, coinType = coinTypes.ETH, network = 'mainnet') => {
  if (typeof publicKey !== 'string') throw new Error('Invalid Public Key')
  if (publicKey.includes('0x')) publicKey = publicKey.slice(2)

  const Q = BigInteger.fromHex(publicKey).toBuffer()
  const newEcPair = ECPair.fromPublicKeyBuffer(Q, { coinType, network })

  return new Wallet({ coinType: coinType.name, network }, newEcPair)
} // read only, can not make a transaction

const fromWIF = (wifString, coinType = coinTypes.BTC, network = 'mainnet', options = {}) => {

  const decoded = wif.decode(wifString)
  const versionWIF = decoded.version
  let networkObj = {}

  switch (coinType.name) {
    case coinTypes.BTC.name:
      networkObj = bitcoin[network]
      if (versionWIF !== networkObj.wif) throw new Error('Invalid networks version')
      break
  }

  const d = BigInteger.fromBuffer(decoded.privateKey)
  const newECPair = new ECPair(d, null, { coinType: coinType.name, network, ...options })
  return new Wallet({ coinType: coinType.name, network, ...options }, newECPair)

} // for BTC only return wallet

const validateMnemonic = mnemonic => bip39.validateMnemonic(mnemonic)

export default {
  ECPair,
  HDNode,
  networks,
  keyHashes,
  coinTypes,
  generateMnemonic,
  makeRandom,
  Wallet,
  Contract: Contract.Contract,
  Interface: Contract.Interface,
  ContractUtils: Contract.ultils,
  fromWIF,
  fromMnemonic,
  fromHDNode,
  validateMnemonic,
  Providers: { ...Providers },
  fromPrivateKey,
  fromPublicKey,
  Units,
  ...dataEncrypt
}
