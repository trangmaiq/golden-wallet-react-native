import axios from 'axios'

import JSONRPC from './json-rpc'
import { getRawAssetTransaction, ASSEST_IDS, API_ENDPOINTS } from '../neo-utils'

export default class CityOfZionProvider extends JSONRPC {
  // Wallet's address
  // Network

  setNetwork = (network) => {
    this.network = network
  }

  setPrivateKey = (privateKey) => {
    this.privateKey = privateKey
  }

  getBalance = (address) => {
    const APIEndPoint = this.getAPIEndPointFromNetwork(this.network)
    return axios.get(APIEndPoint + '/v2/address/balance/' + address)
      .then((res) => {
        return res.data
      })
  }

  getBestNode = (network) => {
    const APIEndPoint = this.getAPIEndPointFromNetwork(network)
    return axios.get(APIEndPoint + '/v2/network/best_node').then((res) => {
      return res.data.node
    })
  }

  getTransactionHistory = (network, address) => {
    const APIEndPoint = this.getAPIEndPointFromNetwork(network)
    return axios.get(APIEndPoint + '/v2/address/history/' + address).then((response) => {
      return response.data.history
    })
  }

  /**
    * @param
    * transaction = {
    *  to: toAddress,
    *  value: Starypto.Units.parseEther(ethString),
    ** assetName: NEO || GAS
    *}
  */

  sendTransaction = (transaction) => {
    const { assetName } = transaction
    const toAddress = transaction.to
    const { value } = transaction

    return this.getBalance(this.address).then((balanceRes) => {
      if (assetName !== 'NEO' && assetName !== 'GAS') {
        return Promise.reject(new Error('Invalid asset name. Must be `NEO` or `GAS`.'))
      }
      const coinsData = {
        assetid: ASSEST_IDS[assetName],
        list: balanceRes[assetName].unspent,
        balance: balanceRes[assetName].balance,
        name: assetName
      }
      const fromAccount = {
        publicKey: this.publicKey,
        privateKey: this.privateKey
      }

      const txRaw = getRawAssetTransaction(this.network, toAddress, fromAccount, value, coinsData)
      return this.getBestNode(this.network).then((node) => {
        const jsonBodyData = {
          jsonrpc: '2.0',
          method: 'sendrawtransaction',
          params: [txRaw],
          id: 15
        }
        return this.fetchJSON(node, jsonBodyData).then((data) => {
          return this.getTransactionHistory(this.network, this.address).then((history) => {
            return history[0].txid
          })
        })
      })
    })
  }

  getAPIEndPointFromNetwork = (network = '') => {
    switch (network) {
      case 'mainnet':
        return API_ENDPOINTS[network]
      case 'testnet':
        return API_ENDPOINTS[network]
      default:
        throw new Error('Unsupported network.')
    }
  }
}
