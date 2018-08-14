import { observable, action, computed } from 'mobx'
import BigNumber from 'bignumber.js'
import WalletToken from './WalletToken'
import Keystore from '../../../Libs/react-native-golden-keystore'
import Starypto from '../../../Libs/react-native-starypto'
import WalletDS from '../DataSource/WalletDS'
import api from '../../api'
import MainStore from '../MainStore'

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

const defaultObjWallet = {
  title: '',
  address: '',
  balance: '0',
  type: 'ethereum',
  path: Keystore.CoinType.ETH.path,
  external: false,
  didBackup: true,
  index: 0,
  isCold: false,
  canSendTransaction: true,
  nonce: 1
}

export default class Wallet {
  secureDS = null

  @observable title = ''
  @observable address = ''
  @observable balance = new BigNumber('0')
  @observable type = 'ethereum'
  path = Keystore.CoinType.ETH.path
  @observable external = false
  @observable didBackup = false
  @observable index = 0
  @observable isCold = false
  @observable canSendTransaction = true
  @observable nonce = 1
  @observable isFetchingBalance = false
  @observable totalBalance = new BigNumber('0')
  @observable isHideValue = false

  @observable tokens = []
  @observable transactions = []
  @observable isRefresh = false

  workerID = null // for update balance polling

  static async generateNew(secureDS, title, index = 0, path = Keystore.CoinType.ETH.path) {
    if (!secureDS) throw new Error('Secure data source is required')

    const mnemonic = await secureDS.deriveMnemonic()
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', path, index)
    const w = Starypto.fromPrivateKey(private_key)
    secureDS.savePrivateKey(w.address, private_key)
    return new Wallet({
      address: w.address, balance: '0', index, title
    }, secureDS)
  }

  static importPrivateKey(privateKey, title, secureDS) {
    const w = Starypto.fromPrivateKey(privateKey)
    secureDS.savePrivateKey(w.address, privateKey)
    return new Wallet({
      address: w.address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Private Key', isFetchingBalance: true, title
    }, secureDS)
  }

  static importAddress(address, title, secureDS) {
    return new Wallet({
      address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Address', isFetchingBalance: true, title, canSendTransaction: false
    }, secureDS)
  }

  static async importMnemonic(mnemonic, title, index, secureDS) {
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', Keystore.CoinType.ETH.path, index)
    const w = Starypto.fromPrivateKey(private_key)
    secureDS.savePrivateKey(w.address, private_key)
    return new Wallet({
      address: w.address, balance: '0', index: -1, external: true, didBackup: true, importType: 'Mnemonic', isFetchingBalance: true, title
    }, secureDS)
  }

  constructor(obj, secureDS) {
    this.secureDS = secureDS
    const initObj = Object.assign({}, defaultObjWallet, obj) // copy
    this._validateData(initObj)

    Object.keys(initObj).forEach((k) => {
      if (k === 'balance') initObj[k] = new BigNumber(initObj.balance)
      if (k === 'totalBalance') initObj[k] = new BigNumber(initObj.totalBalance)
      if (k === 'address') initObj[k] = initObj.address.toLowerCase()

      this[k] = initObj[k]
    })
  }

  setSecureDS(ds) {
    this.secureDS = ds
  }

  _validateData(obj) {
    if (!obj.address) throw new Error('Address is required')
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
    if (!this.secureDS) throw new Error('Secure data source is required')
    if (!this.canSendTransaction) throw new Error('This wallet can not send transaction')
    if (this.external) return await this.secureDS.derivePrivateKey(this.address)

    const mnemonic = await this.secureDS.deriveMnemonic()
    const { private_key } = await Keystore.createHDKeyPair(mnemonic, '', this.path, this.index)
    return private_key
  }

  // Should call this function before remove instance
  destroy() {
    if (this.workerID) clearTimeout(this.workerID)
  }

  async update() {
    await WalletDS.updateWallet(this)
  }

  async save() {
    await WalletDS.addNewWallet(this)
  }

  async remove() {
    await WalletDS.deleteWallet(this.address)
  }

  async implementPrivateKey(secureDS, privateKey) {
    this.canSendTransaction = true
    this.importType = 'Private Key'
    const w = Starypto.fromPrivateKey(privateKey)
    if (w.address.toLowerCase() !== this.address.toLowerCase()) {
      throw new Error('Invalid Private Key')
    }
    await WalletDS.updateWallet(this)
    secureDS.savePrivateKey(this.address, privateKey)
  }

  @action fetchingBalance(isRefresh = false, isBackground = false) {
    this.isRefresh = isRefresh
    this.isFetchingBalance = !isRefresh && !isBackground
    api.fetchWalletInfo(this.address).then(async (res) => {
      const { data } = res.data
      const tokens = data.tokens.map(t => new WalletToken(t, this.address))
      const tokenETH = this.getTokenETH(data)
      const totalTokenDollar = this.tokens.reduce((rs, item) => rs.plus(item.balanceInDollar), new BigNumber('0'))
      const totalTokenETH = totalTokenDollar.dividedBy(MainStore.appState.rateETHDollar)
      this.balance = new BigNumber(`${data.ETH.balance}e+18`)
      this.totalBalance = totalTokenETH
      this.setTokens([tokenETH, ...tokens])
      this.autoSetSelectedTokenIfNeeded(tokens)
      this.update()
      this.isFetchingBalance = false
      this.isRefresh = false
    }).catch((e) => {
      this.isFetchingBalance = false
      this.isRefresh = false
    })
  }

  @action setTokens(tokens) {
    this.tokens = tokens
  }

  @action autoSetSelectedTokenIfNeeded(tokens) {
    const { selectedToken } = MainStore.appState
    const needSetSelectedToken = selectedToken.belongsToWalletAddress === this.address
    if (needSetSelectedToken) {
      const token = tokens.find(t => t.symbol === selectedToken.symbol)
      token && MainStore.appState.setselectedToken(token)
    }
  }

  @action setHideValue(isHide) {
    this.isHideValue = isHide
  }

  @computed get refreshing() {
    return this.isRefresh
  }

  @computed get balanceETH() {
    return this.balance
  }

  @computed get totalBalanceETH() {
    return this.totalBalance
  }

  @computed get totalBalanceDollar() {
    const rate = MainStore.appState.rateETHDollar
    return this.totalBalanceETH.multipliedBy(rate)
  }

  @computed get unspendTransactions() {
    return this.tokens.reduce((_rs, t) => {
      const rs = [..._rs, ...t.unspendTransactions.slice()]
      return rs
    }, [])
  }

  findToken(tokenAddress) {
    const token = this.tokens.find(t => t.address === tokenAddress)
    return token
  }

  getTokenETH(data) {
    const tokenETH = {
      tokenInfo: {
        address: data.address,
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        price: {
          rate: MainStore.appState.rateETHDollar.toString(10)
        }
      },
      balance: Starypto.Units.parseUnits(`${data.ETH.balance}`, 18)._bn.toString(10)
    }

    return new WalletToken(tokenETH, this.address)
  }

  parseNumberToString(number) {
    const arrNum = number.split('.')
    const numberAfterDot = arrNum.length === 2 ? arrNum[1].length : 0
    if (numberAfterDot > 18) {
      return number.slice(0, 18 - numberAfterDot)
    }
    return number
  }

  toJSON() {
    const {
      title, address, balance, type,
      external, didBackup, index, isCold,
      canSendTransaction, nonce, isFetchingBalance,
      totalBalance, importType, isHideValue
    } = this
    return {
      title,
      address,
      balance: balance.toString(10),
      type,
      external,
      didBackup,
      index,
      isCold,
      canSendTransaction,
      nonce,
      isFetchingBalance,
      totalBalance: totalBalance.toString(10),
      importType,
      isHideValue
    }
  }
}
