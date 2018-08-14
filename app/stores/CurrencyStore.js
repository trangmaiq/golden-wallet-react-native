import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import axios from 'axios'

class ObservableCurrencyStore {
  @observable currencyETH = null

  saveCurrency(currencyData) {
    const jsonString = JSON.stringify(currencyData)
    return AsyncStorage.setItem('CURRENCY_DATA', jsonString)
  }

  @action getCurrency() {
    if (!this.currencyETH) {
      this.getCurrencyAPI()
    }
    return AsyncStorage.getItem('CURRENCY_DATA').then((currencyData) => {
      if (!currencyData) {
        return null
      }
      const currency = JSON.parse(currencyData)
      this.currencyETH = currency
      this.getCurrencyAPI()
      return this.currencyETH
    })
  }

  @action getCurrencyAPI() {
    return this.callApi().then((res) => {
      this.currencyETH = res.data.RAW.ETH
      this.saveCurrency(this.currencyETH)
      return this.currencyETH
    })
  }

  @computed get currencyUSD() {
    return this.currencyETH ? this.currencyETH.USD.PRICE : 0
  }

  callApi() {
    const data = {
      fsyms: 'ETH',
      tsyms: 'BTC,USD,EUR,GBP,AUD,CAD,CNY,JPY,RUB'
    }
    return axios({
      url: `https://min-api.cryptocompare.com/data/pricemultifull`,
      params: data,
      method: 'get',
      validateStatus: (status) => {
        return true
      }
    })
  }
}

const CurrencyStore = new ObservableCurrencyStore()
export default CurrencyStore
