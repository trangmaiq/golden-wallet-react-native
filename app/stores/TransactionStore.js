import { observable, action } from 'mobx'
import constant from '../commons/constant'
import CurrencyStore from './CurrencyStore'
import Helper from '../commons/Helper'
import AddressTokenStore from './AddressTokenStore'
import API from '../api'
import NavigationStore from '../navigation/NavigationStore'

class ObservableTransactionStore {
  @observable transactionMap = {}
  @observable.ref pendingTransactionMap = {}
  @observable.ref selectedWallet = null
  @observable.ref selectedToken = null
  @observable isRefreshing = false

  @action reset() {
    this.transactionMap = {}
    this.pendingTransactionMap = {}
  }

  @action setSelectedToken(key) {
    this.selectedToken = key
  }

  @action clearTransactionMap() {
    this.transactionMap = {}
  }

  @action async removePendingTransactionIfDone(address) {
    let pendingTransaction = this.pendingTransactionMap[address] || []
    if (!pendingTransaction || pendingTransaction.length === 0) {
      return
    }
    const ptResults = await Promise.all(pendingTransaction.map((pt) => {
      return API.checkStatusTransaction(pt.hash)
    }))
    // ptResults.map((pt, index) => {
    //   if (pt.data.result.status === '1') {
    //     pendingTransaction.splice(index, 1)
    //   }
    //   return pt
    // })
    pendingTransaction = pendingTransaction.filter((pt, index) => ptResults[index].data.result.status === '')
    const newPendingTransactionMap = {
      ...this.pendingTransactionMap,
      [address]: pendingTransaction
    }

    this.pendingTransactionMap = newPendingTransactionMap
  }

  @action setRefreshing(isRefresh) {
    this.isRefreshing = isRefresh
  }

  @action addPendingTransaction(address, transaction) {
    const pendingTransaction = this.pendingTransactionMap[address] || []
    pendingTransaction.push(transaction)
    const newPendingTransactionMap = {
      ...this.pendingTransactionMap,
      [address]: pendingTransaction
    }

    this.pendingTransactionMap = newPendingTransactionMap
  }

  @action getTransactionAPI(tokenInfo, isRefresh = false, addressStr, data) {
    const keyAddress = data ? `${addressStr} - ${data.contractaddress}` : addressStr
    const pendingTransactions = this.pendingTransactionMap[keyAddress]
    this.selectedWallet = addressStr
    const transactions = this.transactionMap[keyAddress] || {}
    let {
      page = 1, isLoadMore = true, txData = []
    } = transactions
    if (isRefresh) {
      page = 1
      isLoadMore = true
      txData = []
    }
    if (!isLoadMore) {
      return null
    }

    return API.fetchTransactions(addressStr, data, page).then((res) => {
      this.isRefreshing = false
      if (res.data.error) {
        NavigationStore.showPopup(res.data.error.message)
        return null
      }
      const listTransactions = res.data.result
      isLoadMore = listTransactions ? listTransactions.length > 0 : false

      let txs = listTransactions.slice().map((t) => {
        const transaction = t
        transaction.tokenSymbol = data ? data.symbol : 'ETH'
        return transaction
      }).reduce((_result, _tx) => {
        const result = _result
        const tx = _tx
        tx.isSelf = !!result[tx.hash]
        tx.tokenInfo = tokenInfo
        result[tx.hash] = tx
        return result
      }, {})

      txs = Object.keys(txs).map(s => txs[s])

      let totalTx = [...txData, ...txs]

      if (page === 1 && pendingTransactions && pendingTransactions.length > 0) {
        totalTx = [...pendingTransactions, ...totalTx]
      }
      if (isLoadMore) {
        page++
      }
      this.transactionMap = {
        ...this.transactionMap,
        [keyAddress]: {
          txData: totalTx,
          isLoadMore,
          page
        }
      }
      return this.transactionMap
    }).catch((e) => {
      this.isRefreshing = false
      this.transactionMap = {
        ...this.transactionMap,
        [keyAddress]: {
          txData: [],
          isLoadMore,
          page
        }
      }
      // NavigationStore.showPopup(err.message)
    })
  }

  get walletTransactions() {
    const { transactionMap, selectedToken } = this
    const transactions = transactionMap[selectedToken] || {}
    const { txData } = transactions
    if (!txData) {
      return null
    }
    const transactionsFormated = txData.map((transaction, index) => {
      let { tokenSymbol } = transaction
      const { tokenDecimal } = transaction
      let priceUSD = AddressTokenStore.tokenPrice[tokenSymbol || 'ETH']
      if (transaction.tokenInfo && transaction.tokenInfo.name !== '') {
        tokenSymbol = transaction.tokenInfo.symbol
        priceUSD = transaction.tokenInfo.price.rate
      }
      const isSend = transaction.from.toLowerCase() === this.selectedWallet.toLowerCase()
      const fee = transaction.fee ||
        Helper.formatNumber(transaction.gasUsed * transaction.gasPrice / Math.pow(10, 18), 6)
      const balance = Helper.formatNumber(transaction.value / Math.pow(10, tokenDecimal || 18), 4)
      const balanceUSD = Helper.formatNumber(transaction.value / Math.pow(10, tokenDecimal || 18) *
        priceUSD, 2)
      const transactionFormat = {
        type: isSend ? constant.SENT : constant.RECEIVED,
        balance: isSend
          ? `- ${Helper.formatCommaNumber(balance)} ${tokenSymbol || 'ETH'}`
          : `+ ${Helper.formatCommaNumber(balance)} ${tokenSymbol || 'ETH'}`,
        // date: moment(new Date(transaction.timeStamp * 1000)).format('MMM DD, YYYY hh:mm a'),
        date: Helper.formatTransactionDate(transaction.timeStamp),
        balanceUSD: `$${Helper.formatCommaNumber(balanceUSD)}`,
        status: transaction.status !== null ? transaction.status : 1,
        from: transaction.from,
        to: transaction.to,
        hash: transaction.hash,
        fee: `${fee} ETH = $${Helper.formatNumber(fee * CurrencyStore.currencyUSD, 2)}`
      }
      return transactionFormat
    })
    return transactionsFormated
  }
}

const TransactionStore = new ObservableTransactionStore()
export default TransactionStore
