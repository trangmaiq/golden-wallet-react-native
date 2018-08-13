import caller from './api-caller'
import NetworkStore from '../stores/NetworkStore'
import Network from '../Network'
import appState from '../AppStores/AppState'
import NetworkConfig from '../AppStores/stores/Config'

/**
 *
 * @param {String} address
 */
export const fetchWalletInfo = (address) => {
  if (!address) return Promise.reject()
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
  if (NetworkStore.currentNetwork !== Network.MainNet) {
    url = `https://api-${NetworkStore.currentNetwork}.etherscan.io/api`
    // apikey = 'YourApiKeyToken'
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

export const fetchRateETHDollar = () => {
  const data = {
    fsyms: 'ETH',
    tsyms: 'BTC,USD,EUR,GBP,AUD,CAD,CNY,JPY,RUB'
  }
  return caller.get(`https://min-api.cryptocompare.com/data/pricemultifull`, data, true)
}
