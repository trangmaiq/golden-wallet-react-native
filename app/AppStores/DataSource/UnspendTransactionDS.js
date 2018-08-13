import { AsyncStorage } from 'react-native'
import Transaction from '../stores/Transaction'

class UnspendTransactionDS {
  async getUnspendTransactions(key) {
    const unspendTransactions = await AsyncStorage.getItem(key.toLowerCase())
    if (!unspendTransactions) return []

    return JSON.parse(unspendTransactions).map(js => new Transaction(js))
  }

  saveUnspendTx(unspendTransactionsArr, key) {
    const unspendTransactions = unspendTransactionsArr.map(utx => utx.toJSON())
    return AsyncStorage.setItem(key.toLowerCase(), JSON.stringify(unspendTransactions))
  }
}

export default new UnspendTransactionDS()
