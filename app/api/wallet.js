import BigNumber from 'bignumber.js'
import caller from './api-caller'
import appState from '../AppStores/AppState'
import NetworkConfig from '../AppStores/stores/Config'

/**
 *
 * @param {String} address
 */
export const fetchWalletInfo = (address) => {
  if (!address) return Promise.reject()
  if (appState.config.network !== NetworkConfig.networks.mainnet) {
    const urlTest = `https://api-${appState.config.network}.etherscan.io/api`
    const apikey = 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
    const data = {
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey
    }
    return new Promise((resolve, reject) => {
      caller.get(urlTest, data, true).then((res) => {
        const result = {
          data: {
            data: {
              ETH: { balance: new BigNumber(`${res.data.result}e-18`).toString(10) },
              address,
              tokens: []
            }
          }
        }
        resolve(result)
      }).catch(e => reject(e))
    })
  }
  const url = `http://wallet.skylab.vn/balance/${address}`
  return caller.get(url, {}, true)
}

/**
 *
 * @param {String} addressStr
 * @param {Object} data
 */
export const fetchTransactions = (addressStr, data, page = 1) => {
  let url = `https://api.etherscan.io/api`
  const params = data
  params.page = page

  if (appState.config.network !== NetworkConfig.networks.mainnet) {
    url = `https://api-${appState.config.network}.etherscan.io/api`
  }

  if (!addressStr) return Promise.reject()
  return caller.get(url, params, true)
}

/**
 *
 * @param {String} txHash
 */
export const checkStatusTransaction = (txHash) => {
  let url = 'https://api.etherscan.io/api'
  const apikey = 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
  if (appState.config.network !== NetworkConfig.networks.mainnet) {
    url = `https://api-${appState.config.network}.etherscan.io/api`
  }
  const params = {
    module: 'transaction',
    action: 'gettxreceiptstatus',
    txHash,
    apikey
  }
  return caller.get(url, params, true)
}

/**
 *
 * @param {String} address
 */
export const fetchToken = (address) => {
  if (!address) return Promise.reject()
  const url = `http://wallet.skylab.vn/balance/${address}`
  return caller.get(url, {}, true)
}
