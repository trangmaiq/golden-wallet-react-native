import { observable, action } from 'mobx'
import axios from 'axios'

class TickerStore {
  @observable tickers = []

  @action parseData(datas) {
    const originArray = Object.values(datas)
    this.tickers = originArray.map((data) => {
      const information = data.quotes.USD
      return {
        symbol: data.symbol,
        name: data.name,
        balance: information.price.toFixed(2),
        increase: information.percent_change_1h > 0
      }
    })
  }

  callApi() {
    axios.get('https://api.coinmarketcap.com/v2/ticker/?limit=10')
      .then((res) => {
        this.parseData(res.data.data)
      })
  }
}

export default new TickerStore()
