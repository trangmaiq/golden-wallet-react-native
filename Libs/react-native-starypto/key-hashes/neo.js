import CryptoJS from 'crypto-js'
import ecurve from 'ecurve'
import BigInteger from 'bigi'
import { ethereum } from '../networks'
import Utils from '../neo-utils'
import base58 from 'bs58'

const secp256k1 = new (require('elliptic')).ec('secp256k1')

export default class NeoKeyHash {
  constructor(ECPair, network = 'mainnet') {
    this.ECPair = ECPair
    this.network = ethereum[network] || ethereum.mainnet
  }

  getPrivateKey = () => {
    return `0x${this.ECPair.getPrivateKey().toString('hex')}`
  }

  getPublicKey = () => {
    const privateKey = this.ECPair.getPrivateKey().toString('hex')
    const publicKeyEncoded = this.getPublicKeyEncFromPrivateKey(privateKey, true)
    return publicKeyEncoded.toString('hex')
  }

  getAddress = () => {
    const publicKeyEncoded = this.getPublicKey()
    const script = this.createSignatureScript(publicKeyEncoded)
    const programHash = this.getHash(script)
    return this.toAddress(Utils.hexstring2ab(programHash.toString()))
  }

  getPublicKeyEncFromPrivateKey = (privateKey, encode) => {
    const ecparams = ecurve.getCurveByName('secp256r1')
    const curvePt = ecparams.G.multiply(BigInteger.fromBuffer(Utils.hexstring2ab(privateKey)))
    return curvePt.getEncoded(encode)
  }

  getHash = (SignatureScript) => {
    const ProgramHexString = CryptoJS.enc.Hex.parse(SignatureScript)
    const ProgramSha256 = CryptoJS.SHA256(ProgramHexString)
    return CryptoJS.RIPEMD160(ProgramSha256)
  }

  createSignatureScript = (publicKeyEncoded) => {
    return `21${publicKeyEncoded.toString('hex')}ac`
  }

  toAddress = ($ProgramHash) => {
    let data = new Uint8Array(1 + $ProgramHash.length)
    data.set([23])
    data.set($ProgramHash, 1)

    const ProgramHexString = CryptoJS.enc.Hex.parse(Utils.ab2hexstring(data))
    const ProgramSha256 = CryptoJS.SHA256(CryptoJS.SHA256(ProgramHexString))
    const ProgramSha256Buffer = Utils.hexstring2ab(ProgramSha256.toString())

    let datas = new Uint8Array(1 + $ProgramHash.length + 4)
    datas.set(data)
    datas.set(ProgramSha256Buffer.slice(0, 4), 21)

    return base58.encode(datas)
  }
}
