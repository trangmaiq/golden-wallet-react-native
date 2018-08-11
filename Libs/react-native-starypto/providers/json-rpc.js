import axios from 'axios'
import BigInteger from 'bigi'
var BN = require('bn.js')
const secp256k1 = new (require('elliptic')).ec('secp256k1')
import utils from '../ether-utils'
import coinTypes from '../coinTypes'
const EthContract = require('../ether-utils/contract')

export default class JSONRPC {
  url = null
  network = null
  chainId = 0
  defaultGasLimit = 1500000
  name = null
  coinType = null

  constructor(network, chainId, url, coinType) {
    this.name = network
    this.url = url
    this.chainId = chainId
    this.coinType = coinType
  }

  setNetwork = (network) => {
    this.network = network
  }

  fetchJSON = (url, json) => new Promise((resolve, reject) => {
    const headers = {}
    if (json) headers['Content-Type'] = 'application/json'

    axios({
      method: json ? 'post' : 'get',
      url,
      data: json
    }).then((res) => {
      if (res.data.error) return reject(res.data.error)
      return resolve(res.data.result)
    })
  })

  processRequest = (methodName, params) => {
    const requestData = {
      method: methodName,
      params,
      id: 42,
      jsonrpc: '2.0'
    }

    return JSON.stringify(requestData)
  }

  getTransaction = (transaction) => {
    var result = {}

    for (var key in transaction) {
      result[key] = utils.hexlify(transaction[key])
    }

    // Some nodes (INFURA ropsten INFURA mainnet is fine) don't like extra zeros.
    ['gasLimit', 'gasPrice', 'nonce', 'value'].forEach(function (key) {
      if (!result[key]) { return }
      result[key] = utils.hexStripZeros(result[key])
    })

    // Transform "gasLimit" to "gas"
    if (result.gasLimit != null && result.gas == null) {
      result.gas = result.gasLimit
      delete result.gasLimit
    }

    return result
  }

  checkBlockTag = (blockTag) => {
    if (blockTag == null) { return 'latest' }

    if (blockTag === 'earliest') { return '0x0' }

    if (blockTag === 'latest' || blockTag === 'pending') {
      return blockTag
    }

    if (typeof (blockTag) === 'number') {
      return utils.hexStripZeros(utils.hexlify(blockTag))
    }

    if (utils.isHexString(blockTag)) { return utils.hexStripZeros(blockTag) }

    throw new Error('invalid blockTag')
  }

  transactionFields = [
    { name: 'nonce', maxLength: 32, },
    { name: 'gasPrice', maxLength: 32, },
    { name: 'gasLimit', maxLength: 32, },
    { name: 'to', length: 20, },
    { name: 'value', maxLength: 32, },
    { name: 'data' },
  ]

  setNetwork = (network) => {
    this.network = network
  }

  setPrivateKey = (priKey) => {
    let privateKey = `0x${priKey}`
    privateKey = utils.arrayify(privateKey)
    this.keyPair = secp256k1.keyFromPrivate(privateKey)
  }

  call = (methodName, params) => {

    let requestData = {}

    switch (methodName) {
      case 'getBlockNumber':
        requestData = this.processRequest('eth_blockNumber', [])
        break

      case 'getGasPrice':
        requestData = this.processRequest('eth_gasPrice', [])
        break

      case 'getBalance':
        requestData = this.processRequest('eth_getBalance', [params.address.toLowerCase(), this.checkBlockTag(params.blockTag)])
        break

      case 'getTransactionCount':
        requestData = this.processRequest('eth_getTransactionCount', [params.address.toLowerCase(), this.checkBlockTag(params.blockTag)])
        break

      case 'getCode':
        requestData = this.processRequest('eth_getCode', [params.address.toLowerCase(), this.checkBlockTag(params.blockTag)])
        break

      case 'getStorageAt':
        requestData = this.processRequest('eth_getStorageAt', [params.address.toLowerCase(), params.position, this.checkBlockTag(params.blockTag)])
        break

      case 'sendTransaction':
        requestData = this.processRequest('eth_sendRawTransaction', [params.signedTransaction])
        break

      case 'getBlock':
        if (params.blockTag) {
          requestData = this.processRequest('eth_getBlockByNumber', [this.checkBlockTag(params.blockTag), false])
        } else if (params.blockHash) {
          requestData = this.processRequest('eth_getBlockByHash', [params.blockHash, false])
        }
        return Promise.reject(new Error('invalid block tag or block hash'))

      case 'getTransaction':
        requestData = this.processRequest('eth_getTransactionByHash', [params.transactionHash])
        break

      case 'getTransactionReceipt':
        requestData = this.processRequest('eth_getTransactionReceipt', [params.transactionHash])
        break

      case 'call':
        requestData = this.processRequest('eth_call', [this.getTransaction(params.transaction), 'latest'])
        break

      case 'estimateGas':
        requestData = this.processRequest('eth_estimateGas', [this.getTransaction(params.transaction)])
        break

      default:
        break
    }

    return this.fetchJSON(this.url, requestData)
  }

  getBalance(address, blockTag) {
    return this.call('getBalance', { address, blockTag }).then(value => {
      return new BN(value.substring(2), 16).toString()
    })
  }
  getLastestBlock() { }
  getTransactions(address) { }
  sendTransaction(transaction) {
    if (!transaction || typeof (transaction) !== 'object') {
      throw new Error('invalid transaction object')
    }

    const gasLimit = transaction.gasLimit || this.defaultGasLimit
    const gasPricePromise = transaction.gasPrice ? Promise.resolve(transaction.gasPrice) : this.getGasPrice()
    const noncePromise = transaction.nonce ? Promise.resolve(transaction.nonce) : this.getTransactionCount(this.address)
    const data = utils.hexlify(transaction.data || '0x')
    const value = utils.hexlify(transaction.value || 0)
    const chainId = this.chainId
    const self = this

    return Promise.all([gasPricePromise, noncePromise]).then(function (results) {
      const signedTransaction = self.signTransation({
        to: transaction.to,
        data: data,
        gasLimit: gasLimit,
        gasPrice: results[0],
        nonce: results[1],
        value: value,
        chainId: chainId
      })

      return self.call('sendTransaction', { signedTransaction: utils.hexlify(signedTransaction) })
        .then(hash => {
          return hash
        })
    })
  }

  getGasPrice() {
    return this.call('getGasPrice').then(value => {
      return new BN(value.substring(2), 16)
    })
  }

  getTransactionCount(address, blockTag = 'pending') {
    return this.call('getTransactionCount', { address, blockTag }).then(value => {
      return new BN(value.substring(2), 16).toNumber()
    })
  }

  estimateGas = (transaction) => new Promise(async (resolve, reject) => {
    if (!this.keyPair) return reject(new Error('Private key not found'))

    const calculate = {};
    ['from', 'to', 'data', 'value'].forEach(key => {
      if (transaction[key] == null) { return }
      calculate[key] = transaction[key];
    })

    if (transaction.from == null) { calculate.from = this.address }

    try {
      const value = await this.call('estimateGas', { transaction: calculate })
      resolve(new BN(value.substring(2), 16))
    } catch (err) {
      reject(err)
    }
  })

  signDigest(digest) {
    if (!this.keyPair) throw new Error('Private key not found')
    const keyPair = this.keyPair

    var signature = keyPair.sign(utils.arrayify(digest), { canonical: true });
    return {
      recoveryParam: signature.recoveryParam,
      r: '0x' + signature.r.toString(16),
      s: '0x' + signature.s.toString(16)
    }
  }

  signTransation = (transaction) => {
    const chainId = this.chainId

    const raw = []
    this.transactionFields.forEach(function (fieldInfo) {
      let value = transaction[fieldInfo.name] || ([])
      value = utils.arrayify(utils.hexlify(value), fieldInfo.name)

      // Fixed-width field
      if (fieldInfo.length && value.length !== fieldInfo.length && value.length > 0) {
        const error = new Error('invalid ' + fieldInfo.name)
        error.reason = 'wrong length'
        error.value = value
        throw error
      }

      // Variable-width (with a maximum)
      if (fieldInfo.maxLength) {
        value = utils.stripZeros(value)
        if (value.length > fieldInfo.maxLength) {
          const error = new Error('invalid ' + fieldInfo.name)
          error.reason = 'too long'
          error.value = value
          throw error
        }
      }

      raw.push(utils.hexlify(value))
    })

    if (chainId) {
      raw.push(utils.hexlify(chainId))
      raw.push('0x')
      raw.push('0x')
    }

    const digest = utils.keccak256(utils.RLP.encode(raw))
    const signature = this.signDigest(digest)

    var v = 27 + signature.recoveryParam
    if (chainId) {
      raw.pop()
      raw.pop()
      raw.pop()
      v += chainId * 2 + 8
    }

    raw.push(utils.hexlify(v))
    raw.push(signature.r)
    raw.push(signature.s)

    return utils.RLP.encode(raw)
  }
}
