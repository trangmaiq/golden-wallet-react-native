import numeral from 'numeral'
import moment from 'moment'

const trillion = 1000000000000
const billion = 1000000000
const million = 1000000

export default class Helper {
  static randomsColor = []
  static formatNumber(number, numDecimal) {
    const decimal = Math.pow(10, numDecimal)
    const value = Math.floor(number * decimal) / decimal
    return value
  }

  static formatCommaNumber(value) {
    if (value > 1000000) {
      return numeral(value).format('0.0a').toUpperCase()
    }
    if (value > 100000) {
      return numeral(value).format('0,0.[0]')
    }
    if (value > 10000) {
      return numeral(value).format('0,0.[00]')
    }
    if (value > 1000) {
      return numeral(value).format('0,0.[000]')
    }
    return numeral(value).format('0,0.[0000]')
  }

  static createCharacters(length) {
    let secretCharacters = ''
    for (let i = 0; i < length; i++) {
      secretCharacters += '0'
    }
    return secretCharacters
  }

  static getIconCoin(symbol) {
    return `https://s3-us-west-1.amazonaws.com/golden-wallets/coins/logo/${symbol}.png`
  }

  static formatTransactionDate(timeStamp) {
    return moment(new Date(timeStamp * 1000)).calendar(null, {
      sameDay: '[Today] hh:mm A',
      nextDay: 'MMMM DD, YYYY',
      nextWeek: 'MMMM DD, YYYY',
      lastDay: 'MMMM DD, YYYY',
      lastWeek: 'MMMM DD, YYYY',
      sameElse: 'MMMM DD, YYYY'
    })
  }
  static formatETH(value, isAmountScreen = false) {
    if (value) {
      const dataSplit = value.toString().split('.')
      const integer = dataSplit[0]
      let decimal = dataSplit[1] ? dataSplit[1] : 0
      if (integer > million) {
        return this.formatBigValue(integer)
      }
      if (integer >= 1000 && !isAmountScreen) {
        return `${this.numberWithCommas(integer)}`
      }
      if (decimal.length > 4) {
        decimal = decimal.substring(0, 4)
        decimal = this.removeRedundantZeros(decimal)
      }
      const result = `${this.numberWithCommas(integer)}.${decimal}`
      return decimal == 0 ? `${this.numberWithCommas(integer)}` : result
    }
    return 0
  }

  static formatUSD(value, isAmountScreen = false, option = million) {
    if (value) {
      const dataSplit = value.toString().split('.')
      const integer = dataSplit[0]
      let decimal = dataSplit[1] ? dataSplit[1] : 0
      if (integer > option) {
        return this.formatBigValue(integer)
      }
      if (integer >= 10000 && !isAmountScreen) {
        return `${this.numberWithCommas(integer)}`
      }
      if (decimal.length > 2) {
        decimal = decimal.substring(0, 2)
        decimal = this.removeRedundantZeros(decimal)
      }
      const result = `${this.numberWithCommas(integer)}.${decimal}`
      return decimal == 0 ? `${this.numberWithCommas(integer)}` : result
    }
    return 0
  }

  static numberWithCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  static formatBigValue(input) {
    const value = parseInt(input, 10)
    if (value / trillion > 1) {
      return `${Math.floor(value / trillion)}.${this.getSubValue(value, trillion)}T`
    }
    if (value / billion > 1) {
      return `${Math.floor(value / billion)}.${this.getSubValue(value, billion)}B`
    }
    if (value / million > 1) {
      return `${Math.floor(value / million)}.${this.getSubValue(value, million)}M`
    }
    return 0
  }
  static getSubValue(value, range) {
    const temp = value % range
    const subRange = range / 100
    const result = temp / subRange
    return `${Math.floor(result)}`
  }

  static removeRedundantZeros(value) {
    let flag = 0
    for (let i = value.length - 1; i >= 0; i--) {
      if (value[i] != 0) {
        flag = i
        break
      }
    }
    return value.substring(0, flag + 1)
  }
}
