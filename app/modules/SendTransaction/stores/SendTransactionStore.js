import { observable, computed, action } from 'mobx'
import WalletStore from '../../../stores/WalletStore'
import Starypto from '../../../../Libs/react-native-starypto'
import NetworkStore from '../../../stores/NetworkStore'
import { toBigNumber, fromEther } from '../../../wallet/ethereum/txUtils'
import TransactionStore from '../../../stores/TransactionStore'
import constant from '../../../commons/constant'
import CurrencyStore from '../../../stores/CurrencyStore'

const BN = require('bn.js')

// const diffGas = 0.000048

class SendTransactionStore {
  @observable.ref addressModal = null
  @observable.ref qrCodeModal = null
  @observable.ref confirmModal = null
  @observable.ref selectedModal = null
  @observable transaction = {
    gasLimit: 21000,
    gasPrice: 1000000000
  }
  @observable.ref isSendToken = false
  @observable.ref inputValue = null
  @observable wallet = {
    address: '',
    postfix: 'ETH',
    balanceCrypto: 0,
    balanceUSD: 0,
    ratio: CurrencyStore.currencyUSD
  }
  @observable selectedToken = {
    title: 'ETH'
  }
  @observable numberArray = {
    data: [],
    subData: [],
    isHadPoint: false,
    type: false
  }
  cryptoValue = 0.0000
  moneyValue = 0.00

  @computed get getTransaction() {
    return this.transaction
  }

  @computed get getWallet() {
    return WalletStore.selectedWallet
  }

  @computed get fee() {
    return Starypto.Units.formatUnits(`${this.getTransaction.gasLimit * this.getTransaction.gasPrice}`, 18)
  }

  @action setToAddress(address) {
    this.transaction.to = address
  }

  @action setToken(token) {
    this.selectedToken = token
  }

  @action setWallet(wallet) {
    this.wallet = wallet
  }

  @action setValue(value) {
    this.inputValue = value
    this.transaction.value = value
  }

  @action updateValue(value) {
    this.transaction.value = value
  }

  @action setGasLimit(gasLimit) {
    this.transaction.gasLimit = gasLimit
  }

  @action setGasPrice(gasPrice) {
    const gasP = Starypto.Units.parseUnits(`${gasPrice}`, 9)
    this.transaction.gasPrice = gasP
  }

  @action setNumberArray(object) {
    this.numberArray = {
      ...this.numberArray,
      ...object
    }
  }

  @action clearData() {
    this.numberArray = {
      data: [],
      subData: [],
      isHadPoint: false,
      type: false
    }
    this.wallet = {}
    this.transaction = {
      gasLimit: 21000,
      gasPrice: 1000000000
    }
    this.isSendToken = false
  }

  getPrivateKey() {
    return WalletStore.selectedWallet.privateKey
  }

  getWalletSendTransaction(privateKey) {
    const { currentNetwork } = NetworkStore
    const wallet = Starypto.fromPrivateKey(privateKey, Starypto.coinTypes.ETH, currentNetwork)
    wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    return wallet
  }

  @action validateAmount() {
    const wallet = WalletStore.selectedWallet
    const balance = wallet.balanceETH || 0
    const { gasLimit, gasPrice } = this.transaction

    const balanceBN = Starypto.Units.parseUnits(`${balance}`, 18)._bn

    const gasPriceBN = new BN(`${gasPrice}`)
    const gasLimitBN = new BN(`${gasLimit}`)

    const gasBN = gasLimitBN.mul(gasPriceBN).div(new BN('1000000000'))
    const maxBN = balanceBN.sub(gasBN)

    if (this.selectedToken.title !== 'ETH') return maxBN.gte(new BN('0')) // token

    if (maxBN.lt(new BN('0'))) {
      this.updateValue(0)
      return false
    }
    if (new BN(`${this.inputValue}`).gt(maxBN)) {
      this.updateValue(maxBN.toString(10))
    } else {
      this.updateValue(this.inputValue)
    }
    return true
  }

  @action estimateGas() {
    // const wallet = WalletStore.selectedWallet
    // wallet.provider.estimateGas(this.transaction).then((res) => {
    //   this.minGas = res / 1000000000
    //   const gas = Helper.formatNumber(res / 1000000000 + diffGas * 0.5, 6)
    //   console.log('gas', gas)
    //   this.setGasLimit(gas * 1000000000)
    //   this.validateAmount()
    //   // return gas
    // })
    if (this.selectedToken.title === 'ETH') {
      this.setGasLimit(21000)
    } else {
      this.setGasLimit(150000)
    }
    this.validateAmount()
  }

  @action async getGasPrice() {
    this.transaction.gasPrice = 1E9
    // const wallet = WalletStore.selectedWallet
    // return wallet.provider.getGasPrice().then(res => (this.transaction.gasPrice = res))
  }

  sendETH() {
    // !this.transaction.gasLimit && this.estimateGas()
    if (!this.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const valueFormat = this.transaction.value ? fromEther(this.transaction.value).toString(16) : this.transaction.value
    const transactionSend = { ...this.transaction, value: toBigNumber(valueFormat) }

    const wallet = this.getWalletSendTransaction(this.getPrivateKey())
    return new Promise((resolve, reject) => {
      wallet.sendTransaction(transactionSend)
        .then((tx) => {
          const txTempt = this.generatePendingTransaction(tx, { title: 'ETH' }, 18)

          TransactionStore.addPendingTransaction(
            wallet.address.toLowerCase(),
            txTempt
          )
          return resolve(txTempt)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }

  sendToken() {
    // !this.transaction.gasLimit && this.estimateGas()
    if (!this.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const wallet = this.getWalletSendTransaction(this.getPrivateKey())
    const token = this.selectedToken

    const {
      to,
      value,
      gasLimit,
      gasPrice
    } = this.transaction
    const valueSend = toBigNumber(value)
    return new Promise((resolve, reject) => {
      Starypto.ContractUtils.parseContract(token.address)
        .then((contract) => {
          const numberOfDecimals = contract.tokenInfo.decimals
          const numberOfTokens = Starypto.Units.parseUnits(`${valueSend}`, numberOfDecimals)
          const inf = new Starypto.Interface(contract.abi)
          const transfer = inf.functions.transfer(to, numberOfTokens)
          const unspendTransaction = {
            data: transfer.data,
            to: token.address,
            gasLimit,
            gasPrice
          }

          wallet.sendTransaction(unspendTransaction).then((tx) => {
            const txTempt = this.generatePendingTransaction(tx, token, contract.tokenInfo.decimals)
            TransactionStore.addPendingTransaction(
              token.address,
              txTempt
            )
            return resolve(txTempt)
          }).catch((err) => {
            return reject(err)
          })

          // const ct = new Starypto.Contract(token.address, contract.abi, wallet)
          // ct.transfer(to, numberOfTokens).then((tx) => {
          //   const txTempt = this.generatePendingTransaction(tx, token, contract.tokenInfo.decimals)
          //   TransactionStore.addPendingTransaction(
          //     token.address,
          //     txTempt
          //   )
          //   return resolve(txTempt)
          // }).catch((err) => {
          //   return reject(err)
          // })
        }).catch((err) => {
          return reject(err)
        })
    })
  }

  generatePendingTransaction(txHash, token, tokenDecimal) {
    const wallet = WalletStore.selectedWallet
    const {
      to,
      value
      // gasLimit
    } = this.transaction
    const pendingTransaction = {
      type: constant.SENT,
      status: 0,
      from: wallet.address,
      to,
      hash: txHash,
      fee: this.fee,
      timeStamp: Math.floor(Date.now() / 1000),
      value: fromEther(value).toString(16),
      tokenSymbol: token.title,
      tokenDecimal
    }
    return pendingTransaction
  }
}

const sendTransactionStore = new SendTransactionStore()
export default sendTransactionStore
