import wif from 'wif'

import coinTypes from './coinTypes'
import { BitcoinKeyHash, EthereumKeyHash, NeoKeyHash } from './key-hashes'
import bitcoin from './networks/bitcoin'
import { InfuraProvider, CityOfZionProvider } from './providers'
import utils from './ether-utils'

export default class Wallet {
  balance = 0
  EcPair = null
  provider = null
  extAddress = null

  constructor(options, EcPair, extAddress) {
    // if (!EcPair) throw new TypeError('Unexpected EcPair parameter')
    const opts = options || {}
    const { coinType = 'ETH', network = 'mainnet' } = opts

    this.options = { ...options, coinType, network }
    this.EcPair = EcPair

    this.keyHashProvider = this._keyHashProvider(coinType, network)
    this.extAddress = extAddress
  }

  initProvider(name = 'Infura', apiKey = '') {
    let provider = null
    if (name === 'Infura') {
      provider = new InfuraProvider(apiKey, this.options.network)
    }
    if (name === 'CityOfZion') {
      provider = new CityOfZionProvider(this.options.network)
    }

    this.setProvider(provider)
  }

  get coinType() {
    return this.options.coinType
  }

  get network() {
    return this.options.network
  }

  get address() {
    return this.extAddress || this.keyHashProvider.getAddress()
  }

  get privateKey() {
    if (!this.keyHashProvider) return null
    return this.keyHashProvider.getPrivateKey()
  }

  get publicKey() {
    return this.keyHashProvider.getPublicKey()
  }

  setProvider = (provider) => {
    provider.setNetwork(this.options.network)
    provider.address = this.address
    if (!this.extAddress) {
      provider.publicKey = this.keyHashProvider.getPublicKey()
    }

    this.provider = provider

    if (this.canSendTransaction()) {
      provider.setPrivateKey(this.EcPair.getPrivateKey())
    }
  }

  getBalance = (blockTag) => new Promise(async (resolve, reject) => {
    if (!this.provider) return Promise.reject({ key: 'PROVIDER_NOT_FOUND', msg: 'Provider not set' })

    try {
      const result = await this.provider.getBalance(this.address, blockTag)
      resolve(result)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })

  sendTransaction = (transaction) => new Promise(async (resolve, reject) => {
    if (!this.provider) return Promise.reject({ key: 'PROVIDER_NOT_FOUND', msg: 'Provider not set' })
    try {
      const result = await this.provider.sendTransaction(transaction)
      resolve(result)
    } catch (err) {
      console.log(err.message)
      reject(err)
    }
  })

  signTransaction = (transaction) => new Promise(async (resolve, reject) => {
    if (!this.provider) return Promise.reject({ key: 'PROVIDER_NOT_FOUND', msg: 'Provider not set' })
    try {
      const result = this.provider.signTransation(transaction)
      resolve(utils.hexlify(result))
    } catch (err) {
      console.log(err.message)
      reject(err)
    }
  })

  // BTC address
  toWIF = () => {
    let networkObj = {}
    switch (this.options.coinType) {
      case coinTypes.BTC.name:
        networkObj = bitcoin[this.options.network]
    }
    return this.EcPair.toWIF(networkObj.wif)
  }

  _keyHashProvider = (coinTypeName = 'bitcoin', network = 'mainnet') => {
    switch (coinTypeName) {
      case coinTypes.BTC.name:
        return new BitcoinKeyHash(this.EcPair, network)
      case coinTypes.ETH.name:
        return new EthereumKeyHash(this.EcPair, network)
      case coinTypes.NEO.name:
        return new NeoKeyHash(this.EcPair, network)
    }
  }

  canSendTransaction = () => {
    return this.EcPair && this.EcPair.d != null && this.extAddress == null
  }
}
