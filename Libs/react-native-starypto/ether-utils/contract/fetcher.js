import axios from 'axios'

const cachedTokens = {}

const MAIN_API = 'https://api.etherscan.io/'
const RINKEBY_API = 'https://api-rinkeby.etherscan.io/'

export const getABI = (tokenAddress = '', network = 'mainnet') => {
  const URL = (network === 'mainnet') ? MAIN_API : RINKEBY_API

  return axios.get(`${URL}api?module=contract&action=getabi&address=${tokenAddress}`)
}

export const getDetail = (tokenAddress = '', network = 'mainnet') => {
  const URL = `https://api.ethplorer.io/getAddressInfo/${tokenAddress}?apiKey=freekey`
  return axios.get(`${URL}`)
}

export const parseContract = (tokenAddress = '', network = 'mainnet') => {
  if (cachedTokens[tokenAddress]) return Promise.resolve(cachedTokens[tokenAddress])

  return Promise.all([
    getABI(tokenAddress, network),
    getDetail(tokenAddress, network)
  ])
    .then(([apiRes, details]) => {
      const abi = JSON.parse(apiRes.data.result)
      const tokenInfo = details.data.tokenInfo || null

      const contract = { abi, tokenInfo }
      cachedTokens[tokenAddress] = contract
      return contract
    })
}
