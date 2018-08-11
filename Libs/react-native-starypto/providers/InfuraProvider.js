import JSONRPC from './json-rpc'
import coinTypes from '../coinTypes'

export default class InfuraProvider extends JSONRPC {
  apiToken = ''

  constructor(apiToken, network) {
    super(network, 0, '', coinTypes.ETH)
    this.name = network
    this.apiToken = apiToken

    if (network) {
      const { url, chainId } = this.getUrlFromNetwork(network, apiToken)
      this.url = url
      this.chainId = chainId
    }
  }

  setNetwork = (network) => {
    this.network = network

    const { url, chainId } = this.getUrlFromNetwork(network, this.apiToken)
    this.url = url
    this.chainId = chainId
  }

  getUrlFromNetwork = (network, apiToken) => {
    let url = ''
    let chainId = 0
    switch (network) {
      case 'mainnet':
        url = 'mainnet.infura.io'
        chainId = 1
        break
      case 'ropsten':
        url = 'ropsten.infura.io'
        chainId = 3
        break
      case 'rinkeby':
        url = 'rinkeby.infura.io'
        chainId = 4
        break
      case 'kovan':
        url = 'kovan.infura.io'
        chainId = 42
        break
      default:
        throw new Error('unsupported network')
    }

    return { url: `https://${url}/${apiToken || ''}`, chainId }
  }
}