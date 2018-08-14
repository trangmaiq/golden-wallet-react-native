import { AsyncStorage } from 'react-native'
import Transaction from '../stores/Transaction'
import mainStore from '../MainStore'

const dataKey = () => `UNSPEND_TRANSACTIONS_${mainStore.appState.networkName}`

class UnspendTransactionDS {
  async getTransactions() {
    const unspendTransactions = await AsyncStorage.getItem(dataKey())
    if (!unspendTransactions) return []

    return JSON.parse(unspendTransactions).map(tx => new Transaction(tx))
  }

  async addTransaction(transaction) {
    const transactions = await this.getTransactions()
    const find = transactions.find(t => t.hash === transaction.hash)
    if (!find) transactions.push(transaction)
    return this.saveTransactions(transactions)
  }

  saveTransactions(transactionArray) {
    const transactions = transactionArray.map(w => w.toJSON())
    return AsyncStorage.setItem(dataKey(), JSON.stringify(transactions))
  }

  async deleteTransaction(hash) {
    const transactions = await this.getTransactions()
    const result = transactions.filter(t => t.hash != hash)
    return this.saveTransactions(result)
  }
}

export default new UnspendTransactionDS()
