import { observable, action, computed, toJS } from 'mobx'
import WalletDataSource from './WalletDataSource'
const BN = require('bn.js')

// Object Wallet:
// title: 'I am cold wallet',
// address: '0xabc1232432bbfe',
// balance: '1000' (for caching),
// type: 'ethereum', (hiện tại chỉ hỗ trợ loại này)
// external: true, (true là import từ ngoài vào, false là do create)
// didBackup: true, (đã backup hay chưa)
// index: 0, (index trong mnemonic path, nếu là external thì -1)
// isCold: true, (yêu cầu nhập private key khi sign transaction)
// canSendTransaction: true,
// nonce: 1

export default class Wallet {
  @observable title = ''
  @observable address = ''
  @observable balance = new BN('0')
  @observable type = 'ethereum'
  @observable external = false
  @observable didBackup = true
  @observable index = 0
  @observable isCold = false
  @observable canSendTransaction = true
  @observable nonce = 1

  @observable tokens = []
  @observable transactions = []

  workerID = null // for update balance polling

  constructor(walletObj) {
    this.wallet = walletObj
  }

  startWorker() {
    if (this.workerID) clearTimeout(this.workerID)

    this.workerID = setTimeout(() => this.doJob(), 10000)
  }

  doJob() {
    // fetch().then(res => {
    //   this.startWorker()
    // })
  }

  // May get from local and decrypt or from mnemonic
  async derivePrivateKey() {
  }

  // Should call this function before remove instance
  destroy() {
    if (this.workerID) clearTimeout(this.workerID)
  }

  toJSON() {
    const { title, address, balance, type, external, didBackup, index, isCold, canSendTransaction, nonce } = this
    return {
      title,
      address,
      balance,
      type,
      external,
      didBackup,
      index,
      isCold,
      canSendTransaction,
      nonce
    }
  }
}