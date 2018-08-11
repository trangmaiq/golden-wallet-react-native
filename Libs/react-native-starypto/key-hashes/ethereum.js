import typeforce from 'typeforce'
import bs58check from 'bs58check'
import wif from 'wif'
import types from '../types'
import { ethereum } from '../networks'
import bcrypto from '../crypto'

import EtherUtils from '../ether-utils'
const { getAddress, keccak256, hexlify, arrayify } = EtherUtils
const secp256k1 = new (require('elliptic')).ec('secp256k1')

export default class EthereumKeyHash {
  constructor(ECPair, network = 'mainnet') {
    this.ECPair = ECPair
    this.network = ethereum[network] || ethereum.mainnet
  }

  getPrivateKey = () => {
    return `0x${this.ECPair.getPrivateKey().toString('hex')}`
  }

  getPublicKey = () => {
    return `0x${this.ECPair.getPublicKey().toString('hex')}`
  }

  getAddress = () => {
    let keyPair = null

    if (this.ECPair.d) {
      let privateKey = `0x${this.ECPair.getPrivateKey()}`
      privateKey = arrayify(privateKey)
      keyPair = secp256k1.keyFromPrivate(privateKey)
    } else {
      let q = `0x${this.ECPair.getPublicKey()}`
      q = arrayify(q)
      keyPair = secp256k1.keyFromPublic(q)
    }

    const publicKeyConvert = `0x${keyPair.getPublic(false, 'hex')}`
    const publicKey = `0x${this.getPublicKeyToAddress(publicKeyConvert, false).slice(4)}`
    return getAddress('0x' + keccak256(publicKey).substring(26))
  }

  getPublicKeyToAddress = (value, compressed) => {
    value = arrayify(value);
    compressed = !!compressed;

    if (value.length === 32) {
      var keyPair = secp256k1.keyFromPrivate(value);
      return '0x' + keyPair.getPublic(compressed, 'hex');

    } else if (value.length === 33) {
      var keyPair = secp256k1.keyFromPublic(value);
      return '0x' + keyPair.getPublic(compressed, 'hex');

    } else if (value.length === 65) {
      var keyPair = secp256k1.keyFromPublic(value);
      return '0x' + keyPair.getPublic(compressed, 'hex');
    }

    throw new Error('invalid value');
  }
}