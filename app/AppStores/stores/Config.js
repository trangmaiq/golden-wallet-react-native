export default class EthWalletConfig {
  network = null
  infuraKey = null
  chainID = null

  static networks = {
    mainnet: 'mainnet',
    ropsten: 'ropsten',
    rinkeby: 'rinkeby',
    kovan: 'kovan'
  }

  constructor(network, infuraKey) {
    this.network = network
    this.infuraKey = infuraKey

    this.chainID = this.getChainID(network)
  }

  getChainID(name) {
    switch (name) {
      case 'mainnet': return 1
      case 'ropsten': return 3
      case 'rinkeby': return 4
      case 'kovan': return 42
      default: throw new Error('Unsupport network')
    }
  }

  getRPCURL() {
    switch (this.chainID) {
      case 1: return `https://mainnet.infura.io/${this.infuraKey}`
      case 3: return `https://ropsten.infura.io/${this.infuraKey}`
      case 4: return `https://rinkeby.infura.io/${this.infuraKey}`
      case 42: return `https://kovan.infura.io/${this.infuraKey}`
      default: throw new Error('Unsupport network')
    }
  }

  getWSSURL() {
    switch (this.chainID) {
      case 1: return `wss://mainnet.infura.io/ws/${this.infuraKey}`
      case 3: return `wss://ropsten.infura.io/ws/${this.infuraKey}`
      case 4: return `wss://rinkeby.infura.io/ws/${this.infuraKe}`
      case 42: return `wss://kovan.infura.io/ws/${this.infuraKey}`
      default: throw new Error('Unsupport network')
    }
  }

  toJSON() {
    const { network, infuraKey, chainID } = this
    return { network, infuraKey, chainID }
  }
}
