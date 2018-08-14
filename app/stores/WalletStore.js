import { observable, action, computed } from 'mobx'
import { AsyncStorage } from 'react-native'
import Starypto from './../../Libs/react-native-starypto'
import NavStore from './NavStore'
import NetworkStore from './NetworkStore'
import NotificationAPI from '../api/NotificationAPI'
import WalletParser from '../Handler/WalletParser'
import Checker from '../Handler/Checker'
import Network from '../Network'
import CurrencyStore from './CurrencyStore'
import Helper from '../commons/Helper'
import api from '../api'
import Authen from './../secure/Authen'
import KeyStore from './../../Libs/react-native-golden-keystore'
import NotificationStore from './NotificationStore'
// import sendTransactionStore from '../modules/SendTransaction/stores/SendTransactionStore'

class ObservableWalletStore {
  @observable userWallets = null
  @observable.ref mnemonic = null
  @observable.ref selectedIndex = 0
  @observable.ref masterNode = null
  @observable.ref isBackup = null
  @observable isCreateLoading = false
  @observable isSendLoading = false
  @observable isLoadingImportPrivateKey = false
  @observable isLoadingImportAddress = false
  @observable.ref childNode = null
  @observable.ref walletCached = {}
  @observable isFetchingBalance = false

  @computed get dataCards() {
    if (!this.userWallets) {
      return []
    }
    const wallets = this.userWallets.ethWallets ? this.userWallets.ethWallets.slice() : []
    const dataCards = this.converseToCardWallet(wallets)
    return dataCards
  }

  _addWalletSuccess(wallet) {
    if (NotificationStore.enable) {
      NotificationAPI.postDeviceTokenWithWallet(wallet)
    }
  }

  converseToCardWallet(wallets) {
    const dataCards = wallets.map((w, i) => {
      const wallet = WalletParser.parseToPlainWallet(w, i)
      return wallet
    })
    return dataCards
  }

  @action cacheListOriginalWallet() {
    if (!this.userWallets) {
      return
    }
    const wallets = this.userWallets.ethWallets ? this.userWallets.ethWallets.slice() : []
    if (wallets.length === 0) {
      return
    }
    const wallet = wallets[this.selectedIndex] || {}
    if (this.walletCached[wallet.address]) {
      return
    }
    const orginalWallet = WalletParser.parseToOriginWallet(wallet)
    this.walletCached = {
      ...this.walletCached,
      [wallet.address.toLowerCase()]: orginalWallet
    }
  }

  get selectedWallet() {
    if (!this.userWallets) {
      return null
    }
    const wallets = this.userWallets.ethWallets ? this.userWallets.ethWallets.slice() : []
    if (wallets.length === 0) {
      return null
    }

    const wallet = wallets[this.selectedIndex] || {}
    const address = wallet.address.toLowerCase()
    if (this.walletCached[address]) {
      let walletCached = this.walletCached[address]
      if (!walletCached.balanceETH) {
        walletCached.balanceETH = wallet.balanceETH
        walletCached.balance = wallet.balance
        walletCached.balanceValue = wallet.balanceValue
      }
      if (wallet.privateKey) {
        walletCached = { ...wallet, ...walletCached }
      }
      this.walletCached = {
        ...this.walletCached,
        [address]: walletCached
      }
      return walletCached
    }
    const orginalWallet = WalletParser.parseToOriginWallet(wallet)
    this.walletCached = {
      ...this.walletCached,
      [address]: orginalWallet
    }
    return orginalWallet
  }

  @action saveIsBackup() {
    this.isBackup = 'backup'
    return AsyncStorage.setItem('IS_BACKUP', 'backup')
  }

  @action updateBalanceWalletCached(wallet) {
    const walletCached = this.walletCached[wallet.address]
    if (!walletCached) return
    this.walletCached[wallet.address] = { ...walletCached, ...wallet }
    this.walletCached = {
      ...this.walletCached,
      [wallet.address]: walletCached
    }
  }

  @action async getIsBackup() {
    const isBackup = await AsyncStorage.getItem('IS_BACKUP')
    if (isBackup) {
      this.isBackup = isBackup
    }
  }

  @action setSelectedIndex(index) {
    this.selectedIndex = index
  }

  @action saveUserWalletEncrypted(password) {
    if (this.userWallets === null) {
      return null
    }
    const dataString = this.parseToString(this.userWallets)
    const userWalletEncrypted = this.encryptDataAES256(dataString, password, Authen.iv)
    return AsyncStorage.setItem('USER_WALLET_ENCRYPTED', userWalletEncrypted)
  }

  @action editEnableBalance() {
    const userWallets = this.userWallets || {
      mnemonic: this.mnemonic,
      ethIndex: 0,
      ethWallets: []
    }

    const wallets = userWallets.ethWallets || []
    const data = {
      ...userWallets,
      ethWallets: [...wallets]
    }
    this.setUserWallets(data)
  }

  @action editEnableSmallAssets() {
    const userWallets = this.userWallets || {
      mnemonic: this.mnemonic,
      ethIndex: 0,
      ethWallets: []
    }

    const wallets = userWallets.ethWallets || []
    const data = {
      ...userWallets,
      ethWallets: [...wallets]
    }
    this.setUserWallets(data)
  }

  @action editWallet(wallet, i, isAddPrivateKey) {
    let walletEdited = wallet
    const userWallets = this.userWallets || {
      mnemonic: this.mnemonic,
      ethIndex: 0,
      ethWallets: []
    }
    return new Promise((resolve, reject) => {
      if (isAddPrivateKey && wallet.privateKey) {
        walletEdited = Starypto.fromPrivateKey(wallet.privateKey, Starypto.coinTypes.ETH, NetworkStore.currentNetwork)
        if (walletEdited.address.toLowerCase() !== wallet.address) {
          return reject(Error('Invalid private key'))
        }
        walletEdited.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
        walletEdited.balance = wallet.balanceValue
        walletEdited.balanceETH = wallet.balanceETH
        walletEdited.cardName = wallet.cardName
        walletEdited.importType = wallet.importType
        walletEdited.background = wallet.background
        walletEdited.address = wallet.address
      } else {
        walletEdited = {
          ...wallet,
          ...walletEdited,
          balance: wallet.balanceValue,
          balanceETH: wallet.balanceETH
        }
      }

      const wallets = userWallets.ethWallets || []
      const index = userWallets.ethIndex || 0
      wallets[i] = walletEdited

      const data = {
        ...userWallets,
        ethIndex: index,
        ethWallets: [...wallets]
      }
      this.setUserWallets(data)
      NotificationAPI.updateNotificationAllWallet()
      return resolve()
    })
  }

  @action onRemoveWallet(i) {
    this.removeWallet(i)
    if (i === this.userWallets.ethWallets.slice().length &&
      i === this.selectedIndex
    ) {
      this.setSelectedIndex(null)
    }
  }

  removeWallet(i) {
    const userWallets = this.userWallets || {
      mnemonic: this.mnemonic,
      ethIndex: 0,
      ethWallets: []
    }
    const wallets = userWallets.ethWallets || []
    const index = userWallets.ethIndex || 0
    const removeWallet = wallets[i]
    wallets.splice(i, 1)
    const data = {
      ...userWallets,
      ethIndex: index,
      ethWallets: [...wallets]
    }
    NotificationAPI.deleteNotificationWithWallet(removeWallet.address)
    this.setUserWallets(data)
  }

  parseToString(data) {
    const ethWalletsFormated = data.ethWallets
      ? data.ethWallets.slice().map((wallet) => {
        const walletFormat = {
          address: wallet.address,
          privateKey: wallet.privateKey ? wallet.privateKey : '',
          cardName: wallet.cardName,
          background: wallet.background,
          importType: wallet.importType,
          enableSecretBalance: wallet.enableSecretBalance,
          enableSmallAssets: wallet.enableSmallAssets
        }
        return walletFormat
      })
      : []
    const dataJSON = {
      mnemonic: data.mnemonic,
      ethIndex: data.ethIndex || 0,
      ethWallets: ethWalletsFormated
    }
    return JSON.stringify(dataJSON)
  }

  parseToOriginData(dataJSON) {
    const wallets = dataJSON.ethWallets
    this.fetchBalanceAllWallet(wallets)

    return {
      ...dataJSON,
      ethWallets: wallets
    }
  }

  getChildNode = () => {
    if (this.childNode) return this.childNode
    this.masterNode = Starypto.fromMnemonic(this.mnemonic)
    this.childNode = this.masterNode
      .derivePathWithCoinType(Starypto.coinTypes.ETH)
    return this.childNode
  }

  @action async fetchBalanceWallet(wallet) {
    const walletWithBalance = wallet
    const { currentNetwork } = NetworkStore
    if (currentNetwork !== Network.MainNet) {
      const res = await wallet.getBalance()
      const balanceETH = res > 0 ? Starypto.Units.formatEther(res) : res
      const balanceData = {
        balanceETH,
        totalETH: balanceETH
      }
      walletWithBalance.balanceETH = balanceData.balanceETH
      walletWithBalance.balance = balanceData.totalETH
      return walletWithBalance
    }
    const res = await this.getWalletInfo(wallet.address)
    const balanceData = this.getBalanceData(res.data)
    walletWithBalance.balanceETH = balanceData.balanceETH
    walletWithBalance.balance = balanceData.totalETH
    return walletWithBalance
  }

  @action fetchBalanceAllWallet(wallets, onLoaded = () => { }) {
    this.isFetchingBalance = true
    let wls = wallets
    if (!wallets) {
      wls = this.userWallets ? this.userWallets.ethWallets : []
    }
    if (wls.length === 0) {
      onLoaded()
      return
    }
    const { currentNetwork } = NetworkStore
    if (currentNetwork !== Network.MainNet) {
      const originWallets = wls.map((w, i) => {
        const originWallet = WalletParser.parseToOriginWallet(w, i)
        return originWallet
      })
      const getAllBalance = originWallets.map((w) => {
        if (!w.getBalance) return () => { }
        return w.getBalance()
      })
      Promise.all(getAllBalance).then((res) => {
        this.isFetchingBalance = false
        onLoaded()
        wls = wls.map((w, i) => {
          const balanceETH = res[i] > 0 ? Starypto.Units.formatEther(res[i]) : res[i]
          const balanceData = {
            balanceETH,
            totalETH: balanceETH
          }
          const wallet = w
          wallet.balanceETH = balanceData.balanceETH
          wallet.balance = balanceData.totalETH
          wallet.balanceValue = balanceData.balanceETH
          this.updateBalanceWalletCached(wallet)
          if (!sendTransactionStore.isSendToken && w.address === this.selectedWallet.address) {
            const wl = {
              postfix: 'ETH',
              balanceCrypto: balanceData.balanceETH,
              balanceUSD: balanceData.balanceETH * CurrencyStore.currencyUSD,
              ratio: CurrencyStore.currencyUSD
            }
            sendTransactionStore.setWallet(wl)
          }
          return wallet
        })
        this.userWallets = {
          ...this.userWallets,
          ethWallets: wls
        }
      })
    } else {
      Promise.all(wls.map((w) => {
        return this.getWalletInfo(w.address)
      })).then((res) => {
        this.isFetchingBalance = false
        wls = wls.map((w, i) => {
          const balanceData = this.getBalanceData(res[i].data)
          const wallet = w
          wallet.balanceETH = balanceData.balanceETH
          wallet.balance = balanceData.totalETH
          this.updateBalanceWalletCached(wallet)
          if (!sendTransactionStore.isSendToken && w.address === this.selectedWallet.address) {
            const wl = {
              postfix: 'ETH',
              balanceCrypto: balanceData.balanceETH,
              balanceUSD: balanceData.balanceETH * CurrencyStore.currencyUSD,
              ratio: CurrencyStore.currencyUSD
            }
            sendTransactionStore.setWallet(wl)
          }
          return wallet
        })
        this.userWallets = {
          ...this.userWallets,
          ethWallets: wls
        }
        onLoaded()
      })
    }
  }

  getBalanceData(tokenAddress) {
    const balanceETH = Helper.formatNumber(tokenAddress.ETH.balance, 4)
    let totalETH = balanceETH
    if (tokenAddress.tokens) {
      tokenAddress.tokens.slice().map((token, index) => {
        const rate = Math.pow(10, token.tokenInfo.decimals)
        const tokenFormated = {
          balanceUSD: token.tokenInfo.price
            ? Helper.formatNumber((token.balance / rate * token.tokenInfo.price.rate), 2)
            : 0
        }
        totalETH += tokenFormated.balanceUSD / CurrencyStore.currencyUSD
        return token
      })
    }
    const data = {
      balanceETH,
      totalETH
    }
    return data
  }

  getWalletInfo(address) {
    return api.fetchWalletInfo(address).then((res) => {
      if (res.data.error) {
        if (res.data.error.code === 999) {
          NavStore.popupCustom.show('Server is going down to maintain, please try later!')
          return null
        }
        NavStore.popupCustom.show(res.data.error.message)
        return null
      }
      return res.data
    })
  }

  @action fetchUserWallet(userWalletDecrypted) {
    const userWalletJSON = JSON.parse(userWalletDecrypted)
    const originData = this.parseToOriginData(userWalletJSON)
    this.userWallets = originData
    this.mnemonic = this.userWallets.mnemonic
  }

  @action setUserWallets(data) {
    const newData = {
      ...this.userWallets,
      ...data
    }

    this.userWallets = newData
    if (Authen.randomKey && this.userWallets) {
      setTimeout(() => {
        this.saveUserWalletEncrypted(Authen.randomKey)
      }, 250)
    }
  }

  @action async importWalletViaPrivateKey(privateKey) {
    this.isLoadingImportPrivateKey = true
    const { currentNetwork } = NetworkStore
    try {
      const wallet = Starypto.fromPrivateKey(privateKey, Starypto.coinTypes.ETH, currentNetwork)
      wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
      // const walletWithBalance = await this.fetchBalanceWallet(wallet)
      const userWallets = this.userWallets || {
        mnemonic: this.mnemonic,
        ethIndex: 0,
        ethWallets: []
      }
      const index = userWallets.ethIndex || 0
      const wallets = userWallets.ethWallets || []
      const walletIndex = wallets.length
      const walletFormat = WalletParser.parseToPlainWallet(wallet, walletIndex, 'Private Key')
      const isExist = Checker.checkWalletIsExist(wallets, walletFormat.address)
      if (isExist) {
        NavStore.popupCustom.show('wallet is exist')
        this.isLoadingImportPrivateKey = false
        return
      }
      const data = {
        ...userWallets,
        ethIndex: index,
        ethWallets: [...wallets, walletFormat]
      }
      // TODO
      this._addWalletSuccess({ name: walletFormat.cardName, address: walletFormat.address })
      this.fetchBalanceAllWallet(data.ethWallets)
      this.setUserWallets(data)
      this.isLoadingImportPrivateKey = false
    } catch (e) {
      NavStore.popupCustom.show(e)
      this.isLoadingImportPrivateKey = false
    }
  }

  @action setCreateLoading(isLoading) {
    this.isCreateLoading = isLoading
  }

  @action setSendLoading(isLoading) {
    this.isSendLoading = isLoading
  }

  @action createWalletViaMnemonic(name) {
    this.isCreateLoading = true

    return new Promise((resolve, reject) => {
      const userWallets = this.userWallets || {
        ethIndex: 0,
        ethWallets: []
      }
      let index = userWallets.ethIndex || 0
      const wallets = userWallets.ethWallets || []
      setTimeout(async () => {
        const newWallet = await this.createNewETHWallet(index, NetworkStore.currentNetwork, name)
        userWallets.mnemonic = this.mnemonic
        index++
        const data = {
          ...userWallets,
          ethIndex: index,
          ethWallets: [...wallets, newWallet]
        }
        this.setUserWallets(data)
        return resolve(data)
      }, 0)
      return null
    })
  }

  @action importWalletViaAddress(address, name) {
    this.isLoadingImportAddress = true
    return new Promise(async (resolve, reject) => {
      try {
        const userWallets = this.userWallets || {
          mnemonic: this.mnemonic,
          ethIndex: 0,
          ethWallets: []
        }
        const index = userWallets.ethIndex || 0
        const wallets = userWallets.ethWallets || []
        const newWallet = new Starypto.Wallet({ coinType: Starypto.coinTypes.ETH, network: NetworkStore.currentNetwork }, null, address)
        // const walletWithBalance = await this.fetchBalanceWallet(newWallet)
        if (!name) {
          newWallet.cardName = `My wallet ${wallets.length}`
        } else {
          newWallet.cardName = name
        }
        newWallet.importType = 'Address'
        const isExist = this.checkIsWalletExist(wallets, address)
        if (isExist) {
          this.isLoadingImportAddress = false
          NavStore.popupCustom.show('wallet is exist')
          return
        }
        const data = {
          ...userWallets,
          ethIndex: index,
          ethWallets: [...wallets, newWallet]
        }
        // TODO
        this._addWalletSuccess({ name: newWallet.cardName, address })
        this.fetchBalanceAllWallet(data.ethWallets)
        this.setUserWallets(data)
        this.isLoadingImportAddress = false
        resolve()
      } catch (e) {
        this.isLoadingImportAddress = false
        NavStore.popupCustom.show('Invalid Address')
      }
    })
  }

  @action importWalletViaMnemonic(wallet, i) {
    const newWallet = wallet
    return new Promise((resolve, reject) => {
      const userWallets = this.userWallets || {
        mnemonic: this.mnemonic,
        ethIndex: 0,
        ethWallets: []
      }
      let index = userWallets.ethIndex || 0
      if (index < i) {
        index = i
      }
      const wallets = userWallets.ethWallets || []
      newWallet.importType = 'Mnemonic'
      newWallet.cardName = `My wallet ${wallets.length}`
      this.setSelectedIndex(wallets.length)
      const isExist = this.checkIsWalletExist(wallets, wallet.address)
      if (isExist) {
        return reject(Error('wallet is exist'))
      }
      if (i === index) {
        index++
      }
      const data = {
        ...userWallets,
        ethIndex: index,
        ethWallets: [...wallets, newWallet]
      }
      // TODO
      this._addWalletSuccess({ name: `My wallet ${index}`, address: wallet.address })
      this.setUserWallets(data)

      return resolve(data)
    })
  }

  @action async setupMnemonic() {
    let { mnemonic } = this
    if (!mnemonic) {
      mnemonic = await KeyStore.generateMnemonic()
      this.mnemonic = mnemonic
      this.setUserWallets({ mnemonic })
    }
    return mnemonic
  }

  checkIsWalletExist(wallets, address) {
    const isExist = wallets.find((w) => {
      return w.address.toLowerCase() === address.toLowerCase()
    })
    return isExist
  }

  async createNewETHWallet(index = 0, network = 'mainnet', name) {
    const mnemonic = await this.setupMnemonic()

    const hdKeyPair = await KeyStore.createHDKeyPair(mnemonic, '', KeyStore.CoinType.ETH.path, index)
    const wallet = Starypto.fromPrivateKey(hdKeyPair.private_key, Starypto.coinTypes.ETH, network)
    wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    const w = wallet
    w.cardName = name
    const wallets = this.userWallets.ethWallets || []
    const walletFormat = WalletParser.parseToPlainWallet(w, wallets.length)
    this._addWalletSuccess({ name: walletFormat.cardName, address: w.address })
    return walletFormat
  }

  decryptDataAES256(dataEncrypted, password, iv, algorithm = 'aes-256-cbc') {
    // dataDecrypted:
    return Starypto.decryptString(dataEncrypted, password, iv, algorithm)
  }

  encryptDataAES256(dataString, password, iv, algorithm = 'aes-256-cbc') {
    // dataEncrypted:
    return Starypto.encryptString(dataString, password, iv, algorithm)
  }
}

const WalletStore = new ObservableWalletStore()
export default WalletStore
