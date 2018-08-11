import bip39 from 'react-native-bip39'
import { createHmac } from 'react-native-crypto'
import BigInteger from 'bigi'
import ECPair from './ecpair'
import coinTypes from './coinTypes'
import nextFrame from './nextFrame'

var ecurve = require('ecurve')
var curve = ecurve.getCurveByName('secp256k1')
var bcrypto = require('./crypto')

export default class HDNode {
  mnemonic = ''
  // paths = []
  passpharse = null
  keyPair = null
  chainCode = null

  static HIGHEST_BIT = 0x80000000
  static LENGTH = 78
  static MASTER_SECRET = new Buffer('Bitcoin seed')

  constructor(keyPair, chainCode) {
    this.keyPair = keyPair
    this.chainCode = chainCode
  }

  static generate = async () => {
    try {
      // default 128
      const mnemonic = await bip39.generateMnemonic()
      return new HDNode()
    } catch (err) {
      return false
    }
  }

  static fromSeedBuffer = (seed, network) => {
    // typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments)

    if (seed.length < 16) throw new TypeError('Seed should be at least 128 bits')
    if (seed.length > 64) throw new TypeError('Seed should be at most 512 bits')

    var I = createHmac('sha512', HDNode.MASTER_SECRET).update(seed).digest()
    var IL = I.slice(0, 32)
    var IR = I.slice(32)

    // In case IL is 0 or >= n, the master key is invalid
    // This is handled by the ECPair constructor
    var pIL = BigInteger.fromBuffer(IL)
    var keyPair = new ECPair(pIL, null)

    return new HDNode(keyPair, IR)
  }

  static fromMnemonic = (mnemonic = '') => {

  }

  isNeutered = () => {
    return !this.keyPair.d
  }

  deriveHardened = (index) => {
    // typeforce(types.UInt31, index)

    // Only derives hardened private keys by default
    return this.derive(index + HDNode.HIGHEST_BIT)
  }

  derivePathWithCoinType = (coinType = coinTypes.BTC) => {
    const path = coinType.path
    return this.derivePath(path, coinType)
  }

  derivePathWithCoinTypeAsync = (coinType = coinTypes.BTC) => {
    const path = coinType.path
    return new Promise(resolve => resolve(this.derivePathAsync(path, coinType)))
  }

  derivePathAsync = async (path, coinType = null) => {
    if (!coinType) return Promise.reject(new Error('Coin type is not support'))
    // typeforce(types.BIP32Path, path)

    let splitPath = path.split('/')
    if (splitPath[0] === 'm') {
      if (this.parentFingerprint) {
        return Promise.reject(new Error('Not a master node'))
      }

      splitPath = splitPath.slice(1)
    }

    let node = this
    for (let i = 0; i < splitPath.length; i++) {
      const indexStr = splitPath[i]
      let index

      if (indexStr.slice(-1) === "'") {
        index = parseInt(indexStr.slice(0, -1), 10)
        await nextFrame()
        node = node.deriveHardened(index)
        continue
      }

      index = parseInt(indexStr, 10)
      await nextFrame()
      node = node.derive(index)
    }

    node.coinType = coinType
    return node
  }

  derivePath = (path, coinType = null) => {
    if (!coinType) throw new TypeError('CointType is required')
    // typeforce(types.BIP32Path, path)

    var splitPath = path.split('/')
    if (splitPath[0] === 'm') {
      if (this.parentFingerprint) {
        throw new Error('Not a master node')
      }

      splitPath = splitPath.slice(1)
    }

    const childNode = splitPath.reduce(function (prevHd, indexStr) {
      var index
      if (indexStr.slice(-1) === "'") {
        index = parseInt(indexStr.slice(0, -1), 10)
        return prevHd.deriveHardened(index)
      } else {
        index = parseInt(indexStr, 10)
        return prevHd.derive(index)
      }
    }, this)

    // const drPath = new DerivePath(path, childNode)
    // if (!this.paths.find(item => item.path == path)) this.paths.push(drPath)

    childNode.coinType = coinType
    return childNode
  }

  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
  derive = function (index) {
    // typeforce(types.UInt32, index)

    var isHardened = index >= HDNode.HIGHEST_BIT
    var data = new Buffer(37)

    // Hardened child
    if (isHardened) {
      if (this.isNeutered()) throw new TypeError('Could not derive hardened child key')

      // data = 0x00 || ser256(kpar) || ser32(index)
      data[0] = 0x00
      this.keyPair.d.toBuffer(32).copy(data, 1)
      data.writeUInt32BE(index, 33)

      // Normal child
    } else {
      // data = serP(point(kpar)) || ser32(index)
      //      = serP(Kpar) || ser32(index)
      this.keyPair.getPublicKeyBuffer().copy(data, 0)
      data.writeUInt32BE(index, 33)
    }

    var I = createHmac('sha512', this.chainCode).update(data).digest()
    var IL = I.slice(0, 32)
    var IR = I.slice(32)

    var pIL = BigInteger.fromBuffer(IL)

    // In case parse256(IL) >= n, proceed with the next value for i
    if (pIL.compareTo(curve.n) >= 0) {
      return this.derive(index + 1)
    }

    // Private parent key -> private child key
    var derivedKeyPair
    if (!this.isNeutered()) {
      // ki = parse256(IL) + kpar (mod n)
      var ki = pIL.add(this.keyPair.d).mod(curve.n)

      // In case ki == 0, proceed with the next value for i
      if (ki.signum() === 0) {
        return this.derive(index + 1)
      }

      derivedKeyPair = new ECPair(ki, null)

      // Public parent key -> public child key
    } else {
      // Ki = point(parse256(IL)) + Kpar
      //    = G*IL + Kpar
      var Ki = curve.G.multiply(pIL).add(this.keyPair.Q)

      // In case Ki is the point at infinity, proceed with the next value for i
      if (curve.isInfinity(Ki)) {
        return this.derive(index + 1)
      }

      derivedKeyPair = new ECPair(null, Ki)
    }

    const hd = new HDNode(derivedKeyPair, IR)
    hd.depth = this.depth + 1
    hd.index = index
    hd.parentFingerprint = this.getFingerprint().readUInt32BE(0)

    if (this.coinType) hd.coinType = this.coinType
    return hd
  }

  getIdentifier = () => {
    return bcrypto.hash160(this.keyPair.getPublicKeyBuffer())
  }

  getFingerprint = () => {
    return this.getIdentifier().slice(0, 4)
  }
}