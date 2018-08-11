import { observable, action } from 'mobx'
import Starypto from '../../Libs/react-native-starypto'
import WalletStore from './WalletStore'
import Helper from '../commons/Helper'
import constant from '../commons/constant'
import TransactionStore from './TransactionStore'
import { toBigNumber, fromEther } from '../wallet/ethereum/txUtils'

class SendTransactionStore {
  @observable.ref selectedToken = null
  @observable.ref sendingAddress = ''
  @observable.ref rpcID = 0
  @observable.ref type = 'sendETH' // sendETH | sendToken | signTxRequest
  @observable.ref callback = () => { }
  /**
   * to: textSend,
   * value: Starypto.Units.parseEther(valueSend),
   * gasLimit: gas * 1000000000
   */
  @observable.ref transaction = {}

  @action reset() {
    this.selectedToken = null
    this.sendingAddress = ''
    this.rpcID = 0
    this.type = 'sendETH'
  }

  @action setupStore({
    selectedToken = null, sendingAddress = '', rpcID = 0, type = 'sendETH', transaction, callback = () => { }
  }) {
    this.reset()
    const wallet = WalletStore.selectedWallet

    this.transaction = transaction
    this.selectedToken = selectedToken
    this.sendingAddress = sendingAddress
    this.rpcID = rpcID

    if (type === 'sendETH') {
      const diffGas = 0.000048
      const tx = {
        to: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9',
        value: Starypto.Units.parseEther('0.001')
      }
      wallet.provider.estimateGas(tx).then((res) => {
        this.setGasLimit(Helper.formatNumber(res / 1000000000 + diffGas * 0.5, 6))
      })
    }

    if (type === 'signTxRequest') {
      this.transaction = {
        ...transaction,
        chainId: wallet.provider.chainId,
        gasLimit: transaction.gas || transaction.gasLimit
      }
      this.callback = callback
    }
  }

  @action setType(type) {
    this.type = type
  }

  @action setSelectedToken(token) {
    this.selectedToken = token
    this.type = (!token || token.title === 'ETH') ? 'sendETH' : 'sendToken'
  }

  @action setSendingAddress(address) {
    this.sendingAddress = address
    this.transaction = {
      ...this.transaction,
      to: address
    }
  }

  @action setValue(value) {
    const valueFormat = value ? fromEther(value).toString(16) : value
    this.transaction = {
      ...this.transaction,
      value: valueFormat
    }
  }

  @action setGasLimit(gas) {
    this.transaction = {
      ...this.transaction,
      gasLimit: gas * 1000000000
    }
  }

  @action setTransaction(transaction) {
    this.transaction = transaction
  }

  @action setRpcId(id) {
    this.rpcID = id
  }

  @action submit() {
    if (this.type === 'sendETH') return this.sendETH()
    if (this.type === 'sendToken') return this.sendToken()
    return this.completeSignTx()
  }

  @action sendETH() {
    const wallet = WalletStore.selectedWallet
    const { transaction } = this

    const transactionSend = {
      ...transaction,
      value: toBigNumber(transaction.value)
    }

    return new Promise((resolve, reject) => {
      WalletStore.setSendLoading(true)
      wallet.sendTransaction(transactionSend)
        .then((tx) => {
          WalletStore.setSendLoading(false)
          const txTempt = this.generatePendingTransaction(tx, { title: 'ETH' }, 18)
          TransactionStore.addPendingTransaction(
            wallet.address.toLowerCase(),
            txTempt
          )
          this.setValue('')
          return resolve(txTempt)
        })
        .catch((err) => {
          WalletStore.setSendLoading(false)
          return reject(err)
        })
    })
  }

  @action sendToken() {
    const wallet = WalletStore.selectedWallet
    const token = this.selectedToken
    const {
      to,
      value
    } = this.transaction
    const valueSend = toBigNumber(value)
    return new Promise((resolve, reject) => {
      WalletStore.setSendLoading(true)
      Starypto.ContractUtils.parseContract(token.address)
        .then((contract) => {
          const numberOfDecimals = contract.tokenInfo.decimals
          const numberOfTokens = Starypto.Units.parseUnits(valueSend, numberOfDecimals)

          const ct = new Starypto.Contract(token.address, contract.abi, wallet)
          ct.transfer(to, numberOfTokens).then((tx) => {
            const txTempt = this.generatePendingTransaction(tx, token, contract.tokenInfo.decimals)
            TransactionStore.addPendingTransaction(
              token.address,
              txTempt
            )
            WalletStore.setSendLoading(false)
            return resolve(txTempt)
          }).catch((err) => {
            WalletStore.setSendLoading(false)
            return reject(err)
          })
        })
    })
  }

  @action completeSignTx() {
    const wallet = WalletStore.selectedWallet
    wallet.signTransaction(this.transaction)
      .then((signedTx) => {
        this.callback(null, signedTx)
        this.callback = null
      })
      .catch(() => {
        this.callback('Can not sign this transaction', null)
        this.callback = null
      })
  }

  generatePendingTransaction(txHash, token, tokenDecimal) {
    const wallet = WalletStore.selectedWallet
    const { to, value, gasLimit } = this.transaction
    const pendingTransaction = {
      type: constant.SENT,
      status: 0,
      from: wallet.address,
      to,
      hash: txHash,
      fee: `${gasLimit}`,
      timeStamp: Math.floor(Date.now() / 1000),
      value,
      tokenSymbol: token.title,
      tokenDecimal
    }
    return pendingTransaction
  }
}

const sendStore = new SendTransactionStore()
export default sendStore
