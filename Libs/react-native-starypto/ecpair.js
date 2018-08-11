// var baddress = require('./address')
var bcrypto = require('./crypto')
var ecdsa = require('./ecdsa')
var randomBytes = require('react-native-randombytes').randomBytes
var typeforce = require('typeforce')
var types = require('./types')
var wif = require('wif')
var bs58check = require('bs58check')
var coinTypes = require('./coinTypes')

var NETWORKS = require('./networks')
var BigInteger = require('bigi')
var ecurve = require('ecurve')

import BitcoinKeyHash from './key-hashes/bitcoin'
var secp256k1 = ecdsa.__curve
function ECPair(d, Q, options) {

  options = options || {}

  if (d) {
    if (d.signum() <= 0) throw new Error('Private key must be greater than 0')
    if (d.compareTo(secp256k1.n) >= 0) throw new Error('Private key must be less than the curve order')
    if (Q) throw new TypeError('Unexpected publicKey parameter')

    this.d = d
  } else {
    // typeforce(types.ECPoint, Q)

    this.__Q = Q
  }

  this.compressed = options.compressed === undefined ? true : options.compressed
  this.coinType = options.coinType || coinTypes.BTC

  // this.network = options.network || NETWORKS.bitcoin
}

Object.defineProperty(ECPair.prototype, 'Q', {
  get: function () {
    if (!this.__Q && this.d) {
      this.__Q = secp256k1.G.multiply(this.d)
    }

    return this.__Q
  }
})

ECPair.fromPublicKeyBuffer = function (buffer, options) {
  var Q = ecurve.Point.decodeFrom(secp256k1, buffer)

  return new ECPair(null, Q, options)
}

// ECPair.fromWIF = function (string, network) {
//   var decoded = wif.decode(string)
//   var version = decoded.version

//   // list of networks?
//   if (types.Array(network)) {
//     network = network.filter(function (x) {
//       return version === x.wif
//     }).pop()

//     if (!network) throw new Error('Unknown network version')

//     // otherwise, assume a network object (or default to bitcoin)
//   } else {
//     network = network || NETWORKS.bitcoin

//     if (version !== network.wif) throw new Error('Invalid network version')
//   }

//   var d = BigInteger.fromBuffer(decoded.privateKey)

//   return new ECPair(d, null, {
//     compressed: decoded.compressed,
//     network: network
//   })
// }

ECPair.makeRandom = function (options) {
  options = options || {}

  var rng = options.rng || randomBytes

  var d
  do {
    var buffer = rng(32)
    typeforce(types.Buffer256bit, buffer)

    d = BigInteger.fromBuffer(buffer)
  } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0) // d > 0 && d < n

  return new ECPair(d, null, options)
}

ECPair.prototype.getPrivateKey = function () {
  return this.d.toHex()
}

ECPair.prototype.getPublicKey = function () {
  return BigInteger.fromBuffer(this.getPublicKeyBuffer()).toHex()
}

// ECPair.prototype.getAddress = function () {
//   // Address BTC
//   return toBase58Check(bcrypto.hash160(this.getPublicKeyBuffer()), 0x00)
//   // Address ETH
// }

ECPair.prototype.getNetwork = function () {
  return this.network
}

ECPair.prototype.getPublicKeyBuffer = function () {
  return this.Q.getEncoded(this.compressed)
}

ECPair.prototype.sign = function (hash) {
  if (!this.d) throw new Error('Missing private key')

  return ecdsa.sign(hash, this.d)
}

ECPair.prototype.toWIF = function (networkWIF) {
  if (!this.d) throw new Error('Missing private key')

  return wif.encode(networkWIF, this.d.toBuffer(32), this.compressed)
}

ECPair.prototype.verify = function (hash, signature) {
  return ecdsa.verify(hash, signature, this.Q)
}

// function toBase58Check(hash, version) {
//   typeforce(types.tuple(types.Hash160bit, types.UInt8), arguments)

//   var payload = new Buffer(21)
//   payload.writeUInt8(version, 0)
//   hash.copy(payload, 1)

//   return bs58check.encode(payload)
// }

module.exports = ECPair
