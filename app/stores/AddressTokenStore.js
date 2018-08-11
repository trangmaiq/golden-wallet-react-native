import { observable, action, computed } from 'mobx'
import CurrencyStore from './CurrencyStore'
import Helper from '../commons/Helper'
import API from '../api'
import NetworkStore from './NetworkStore'
import Network from '../Network'
// import TransactionStore from './TransactionStore'
import NavigationStore from '../navigation/NavigationStore'

class ObservableTokenStore {
  @observable tokenAddressMap = {}
  @observable.ref selectedAddress = null
  @observable isLoading = false
  @observable.ref tokenPrice = {}
  @observable isRefreshing = false

  @action reset() {
    this.tokenAddressMap = {}
  }

  @action clearSelectedAddress() {
    this.selectedAddress = null
  }

  @action setRefreshing(isRefresh) {
    this.isRefreshing = isRefresh
  }

  @action async setupStore(address, balance) {
    try {
      this.selectedAddress = address
      let data = {}
      if (NetworkStore.currentNetwork !== Network.MainNet) {
        data = {
          address,
          ETH: { balance }
        }
        this.isLoading = false
      } else {
        data = await this.getTokenAddressAPI(address)
      }
      this.setTokenPrice(data)
      const tokenAddressMap = {
        ...this.tokenAddressMap,
        [address]: data
      }
      this.tokenAddressMap = tokenAddressMap
      this.setRefreshing(false)
    } catch (e) {
      console.log(e)
      this.setRefreshing(false)
    }
  }

  @action initDataWalletWhenCreate(address) {
    const dataWallet = {
      ETH: {
        balance: 0
      },
      address,
      token: []
    }
    const tokenAddressMap = {
      ...this.tokenAddressMap,
      [address]: dataWallet
    }
    this.tokenAddressMap = tokenAddressMap
  }

  @action hideLoading() {
    setTimeout(() => {
      this.isLoading = false
    }, 500)
  }

  getTokenAddressAPI(address) {
    if (!this.isRefreshing) {
      this.isLoading = true
    }
    return API.fetchToken(address).then((res) => {
      this.hideLoading()
      if (res.data.error) {
        if (res.data.error.code === 999) {
          NavigationStore.showPopup('Server is going down to maintain, please try later!')
          return null
        }
        NavigationStore.showPopup(res.data.error.message)
        return null
      }
      return res.data.data
    }).catch((e) => {
      this.hideLoading()
      NavigationStore.showPopup(e.message)
    })
  }

  @action setTokenPrice(data) {
    const tokenAddressData = this.parseData(data)
    const { tokens } = tokenAddressData
    tokens.map((t) => {
      let price = Helper.formatNumber((t.balanceUSD / t.balance), 2)
      if (t.title === 'ETH') {
        price = CurrencyStore.currencyUSD
      }
      this.tokenPrice = {
        [t.title]: price,
        ...this.tokenPrice
      }
      return t
    })
  }

  @computed get getTokenAddress() {
    const tokenAddress = this.tokenAddressMap[this.selectedAddress]
    if (!tokenAddress) {
      return {}
    }
    const tokenAddressData = this.parseData(tokenAddress)
    return tokenAddressData
  }

  parseData(tokenData) {
    const balanceETH = tokenData.ETH.balance
    const dataCoin = {
      title: 'ETH',
      subtitle: 'Ethereum',
      balance: balanceETH,
      balanceUSD: CurrencyStore.currencyUSD * balanceETH,
      address: this.selectedAddress
    }
    let totalETH = dataCoin.balance
    let dataTokens = []
    if (tokenData.tokens) {
      dataTokens = tokenData.tokens.slice().map((token, index) => {
        const rate = Math.pow(10, token.tokenInfo.decimals)
        const tokenFormated = {
          title: token.tokenInfo.symbol,
          subtitle: token.tokenInfo.name,
          balance: Helper.formatNumber(token.balance / rate, 4),
          balanceUSD: token.tokenInfo.price
            ? Helper.formatNumber((token.balance / rate * token.tokenInfo.price.rate), 2)
            : 0,
          address: token.tokenInfo.address,
          randomColor: Helper.randomsColor[index % 100]
        }
        totalETH += tokenFormated.balanceUSD / CurrencyStore.currencyUSD
        return tokenFormated
      })
    }
    const tokenList = [dataCoin, ...dataTokens]
    const tokenListSorted = tokenList.sort((a, b) => b.balanceUSD - a.balanceUSD)
    const tokenAddressData = {
      totalETH,
      totalUSD: totalETH * CurrencyStore.currencyUSD,
      tokens: tokenListSorted
    }
    return tokenAddressData
  }
}

const TokenStore = new ObservableTokenStore()
export default TokenStore
