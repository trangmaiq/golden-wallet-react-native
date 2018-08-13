import { BigNumber } from 'bignumber.js'
import constant from '../../commons/constant'
import Helper from '../../commons/Helper'
import MainStore from '../MainStore'

const defaultData = {
  blockNumber: '0',
  timeStamp: '0', // required
  hash: '', // required
  nonce: '0',
  blockHash: '0x00',
  from: '0x00', // required
  contractAddress: '0x00', // required
  to: '0x00', // required
  value: '0', // required
  tokenName: '', // required
  tokenSymbol: '', // required
  tokenDecimal: '', // required
  transactionIndex: '0',
  gas: '0', // required
  gasPrice: '0', // required
  gasUsed: '0',
  cumulativeGasUsed: '0',
  input: '0x00',
  confirmations: '97923',
  status: 1 // not in API (0:pending | 1:success | 2:not_send)
}

export default class Transaction {
  token = null

  static generateUnspendTransaction(obj, token) {
    const transaction = { ...obj, status: 0 }
    return new Transaction(transaction, token)
  }

  constructor(obj, token) {
    this.token = token

    const initObj = Object.assign({}, defaultData, obj)

    Object.keys(initObj).forEach((k) => {
      switch (k) {
        case 'value':
        case 'gas':
        case 'gasPrice':
        case 'gasUsed':
          this[k] = new BigNumber(`${initObj[k]}`)
          break
        case 'tokenDecimal':
          this[k] = initObj[k] !== '' ? initObj[k] : 18
          break
        default:
          this[k] = initObj[k]
          break
      }
    })
  }

  save(key) {
    // call ds
  }

  get isETH() {
    return this.tokenSymbol.toLowerCase() === 'eth'
  }

  get isSent() {
    return this.from.toLocaleLowerCase() === MainStore.appState.selectedWallet.address.toLocaleLowerCase()
  }

  get type() {
    if (this.status === 0) return constant.PENDING
    return this.isSent ? constant.SENT : constant.RECEIVED
  }

  get decimal() {
    return this.isETH ? 18 : this.tokenDecimal
  }

  get fee() {
    return this.gasUsed.multipliedBy(this.gasPrice).dividedBy(new BigNumber(`1.0e+24`))
  }

  get balance() {
    return this.value.dividedBy(new BigNumber(`1.0e+${this.decimal}`))
  }

  get balanceUSD() {
    return this.balance.multipliedBy(this.token.rate)
  }

  get date() {
    return Helper.formatTransactionDate(this.timeStamp)
  }
}
