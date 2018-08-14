import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import { NavigationActions } from 'react-navigation'
import AmountStore from './AmountStore'
import AddressInputStore from './AddressInputStore'
import ConfirmStore from './ConfirmStore'
import AdvanceStore from './AdvanceStore'
import Starypto from '../../../../Libs/react-native-starypto'
import { toBigNumber, fromEther } from '../../../wallet/ethereum/txUtils'
import MainStore from '../../../AppStores/MainStore'
import constant from '../../../commons/constant'
import NavStore from '../../../stores/NavStore'
import SecureDS from '../../../AppStores/DataSource/SecureDS'
import HapticHandler from '../../../Handler/HapticHandler'

// import NavigationStore from '../../../navigation/NavigationStore'
// import ScreenID from '../../../navigation/ScreenID'

const BN = require('bn.js')

class SendStore {
  @observable isToken = false
  amountStore = null
  addressInputStore = null
  confirmStore = null

  @observable transaction = {
    gasLimit: new BN('21000'),
    gasPrice: new BN('1000000000')
  }

  constructor() {
    this.amountStore = new AmountStore()
    this.addressInputStore = new AddressInputStore()
    this.confirmStore = new ConfirmStore()
    this.advanceStore = new AdvanceStore()
  }

  @computed get address() {
    return this.addressInputStore.address
  }

  getPrivateKey(ds) {
    MainStore.appState.selectedWallet.setSecureDS(ds)
    return MainStore.appState.selectedWallet.derivePrivateKey()
  }

  getWalletSendTransaction(privateKey) {
    const { network } = MainStore.appState.config
    const wallet = Starypto.fromPrivateKey(privateKey, Starypto.coinTypes.ETH, network)
    wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    return wallet
  }

  @action changeIsToken(bool) {
    this.isToken = bool
  }

  sendTx() {
    const transaction = {
      value: this.confirmStore.value,
      to: this.address,
      gasLimit: this.confirmStore.gasLimit.toNumber(),
      gasPrice: this.confirmStore.gasPrice.toNumber()
    }
    // NavigationStore.showModal(ScreenID.UnlockScreen, {
    //   runUnlock: true,
    //   onUnlock: () => {
    //     setTimeout(() => {
    //       const ds = new SecureDS('9999')
    //       if (!this.isToken) {
    //         this.sendETH(transaction, ds)
    //       } else {
    //         this.sendToken(transaction)
    //       }
    //     }, 50)
    //   }
    // }, true)
    NavStore.lockScreen({
      onUnlock: (pincode) => {
        NavStore.showLoading()
        const ds = new SecureDS(pincode)
        if (!this.isToken) {
          return this.sendETH(transaction, ds)
            .then(res => this._onSendSuccess(res))
            .catch(err => this._onSendFail(err))
        }
        return this.sendToken(transaction, ds)
          .then(res => this._onSendSuccess(res))
          .catch(err => this._onSendFail(err))
      }
    }, true)
  }

  _onSendSuccess = (res) => {
    NavStore.hideLoading()
    HapticHandler.NotificationSuccess()
    NavStore.navigator.dispatch(NavigationActions.back())
    NavStore.navigator.dispatch(NavigationActions.back())
    // MainStore.clearSendStore()
    NavStore.popupCustom.show('Send success')
  }

  _onSendFail = (err) => {
    NavStore.hideLoading()
    NavStore.popupCustom.show(err.message)
  }

  sendETH(transaction, ds) {
    if (!this.confirmStore.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const valueFormat = transaction.value ? transaction.value.times(new BigNumber(1e+18)).toString(16) : transaction.value
    const transactionSend = { ...transaction, value: `0x${valueFormat}` }
    return new Promise((resolve, reject) => {
      this.getPrivateKey(ds).then((privateKey) => {
        const wallet = this.getWalletSendTransaction(privateKey)
        wallet.sendTransaction(transactionSend)
          .then((tx) => {
            this.generatePendingTransaction(tx, transaction, this.isToken)
            return resolve(tx)
          })
          .catch((err) => {
            return reject(err)
          })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  sendToken(transaction, ds) {
    if (!this.confirmStore.validateAmount()) {
      const err = { message: 'Not enough gas to send this transaction' }
      return Promise.reject(err)
    }
    const token = MainStore.appState.selectedToken
    const {
      to,
      value
    } = transaction
    return new Promise((resolve, reject) => {
      this.getPrivateKey(ds).then((privateKey) => {
        const wallet = this.getWalletSendTransaction(privateKey)
        Starypto.ContractUtils.parseContract(token.address)
          .then((contract) => {
            const numberOfDecimals = contract.tokenInfo.decimals
            // const numberOfTokens = Starypto.Units.parseUnits(`${valueSend}`, numberOfDecimals)
            const numberOfTokens = `0x${value.times(new BigNumber(`1e+${numberOfDecimals}`)).toString(16)}`
            const inf = new Starypto.Interface(contract.abi)
            const transfer = inf.functions.transfer(to, numberOfTokens)
            const unspentTransaction = {
              data: transfer.data,
              to: token.address,
              gasLimit: transaction.gasLimit,
              gasPrice: transaction.gasPrice
            }

            wallet.sendTransaction(unspentTransaction).then((tx) => {
              this.generatePendingTransaction(tx, transaction, this.isToken)
              return resolve(tx)
            }).catch(err => reject(err))
          }).catch((err) => {
            return reject(err)
          })
      })
    })
  }

  generatePendingTransaction(txHash, transaction, isToken) {
    const { selectedToken, selectedWallet } = MainStore.appState
    const {
      to,
      value,
      gasLimit,
      gasPrice
    } = transaction
    const pendingTransaction = {
      timeStamp: Math.floor(Date.now() / 1000),
      hash: txHash,
      from: selectedWallet.address,
      contractAddress: isToken ? selectedToken.address : '',
      to,
      value: isToken
        ? new BigNumber(value).times(`1.0e+${selectedToken.decimals}`).toString(10)
        : new BigNumber(value).times('1.0e+18').toString(10),
      tokenName: isToken ? selectedToken.title : 'Ethereum',
      tokenSymbol: isToken ? selectedToken.symbol : 'ETH',
      tokenDecimal: isToken ? selectedToken.decimals : 18,
      gas: gasLimit,
      gasPrice
    }

    selectedToken.addUnspendTransaction(pendingTransaction)
  }
}

export default SendStore
