import caller from './api-caller'
import NetworkStore from '../stores/NetworkStore'
import Network from '../Network'

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
export const fetchTransactions = (addressStr, data = {
  module: 'account',
  action: 'txlist',
  address: addressStr,
  startblock: 0,
  sort: 'desc',
  endblock: 99999999,
  offset: 8,
  apikey: 'SVUJNQSR2APDFX89JJ1VKQU4TKMB6W756M'
}, page = 1) => {
  let url = `https://api.etherscan.io/api`
  const params = data
  params.page = page
  if (NetworkStore.currentNetwork !== Network.MainNet) {
    url = `https://api-${NetworkStore.currentNetwork}.etherscan.io/api`
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
