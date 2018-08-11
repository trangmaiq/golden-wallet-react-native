import typeforce from 'typeforce'
import bs58check from 'bs58check'
import wif from 'wif'
import types from '../types'
import { bitcoin } from '../networks'
import bcrypto from '../crypto'

export default class BitcoinKeyHash {
  constructor(ECPair, network = 'mainnet') {
    // super()
    this.ECPair = ECPair
    this.network = bitcoin[network] || bitcoin.mainnet
  }

  getPrivateKey = () => {
    return `0x${this.ECPair.getPrivateKey().toString('hex')}`
  }

  getPublicKey = () => {
    return `0x${this.ECPair.getPublicKey().toString('hex')}`
  }

  getAddress = () => {
    return this.toBase58Check(bcrypto.hash160(this.ECPair.getPublicKeyBuffer()), this.network.pubKeyHash)
  }

  WIF = () => {
    if (!this.ECPair.d) throw new Error('Missing private key')
    return wif.encode(this.network.wif, this.ECPair.d.toBuffer(32), this.ECPair.compressed)
  }

  static fromWIF = (string, network) => {

  }

  toBase58Check = (hash, version) => {
    // typeforce(types.tuple(types.Hash160bit, types.UInt8), [hash, version])

    var payload = new Buffer(21)
    payload.writeUInt8(version, 0)
    hash.copy(payload, 1)

    return bs58check.encode(payload)
  }
}