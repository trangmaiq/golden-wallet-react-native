import { observable, action, computed } from 'mobx'
import Starypto from './../../Libs/react-native-starypto'
import WalletParser from '../Handler/WalletParser'
import NetworkStore from './NetworkStore'

class ObservableImportWalletStore {
  @observable walletsViaMnemonicMap = {}
  @observable isFetchingWalletViaMnemonic = false
  @observable.ref selectedWallet = -1
  @observable.ref mnemonic = null

  @computed get listWalletViaMnemonic() {
    const { mnemonic } = this
    if (!mnemonic) {
      return []
    }
    const walletsMap = this.walletsViaMnemonicMap[mnemonic].slice().map((w, i) => {
      const wallet = {
        ...w,
        isSelected: this.selectedWallet === i
      }
      return wallet
    })
    return walletsMap
  }

  @action setSelectedWallet(index) {
    if (this.selectedWallet === index) {
      this.selectedWallet = -1
    } else {
      this.selectedWallet = index
    }
  }

  @action installWalletViaMnemonic(mnemonic) {
    this.mnemonic = mnemonic
    this.isFetchingWalletViaMnemonic = true
    return new Promise((resolve, reject) => {
      const validateMnemonic = this.validateMnemonic(mnemonic)
      if (!validateMnemonic) {
        this.isFetchingWalletViaMnemonic = false
        // alert('Invalid Mnemonic')
        return reject(Error('Invalid Mnemonic'))
      }
      if (this.walletsViaMnemonicMap[mnemonic]) {
        this.isFetchingWalletViaMnemonic = false
        return resolve(this.walletsViaMnemonicMap)
      }
      setTimeout(async () => {
        const masterNode = Starypto.fromMnemonic(mnemonic)
        const wallets = []
        for (let i = 0; i < 5; i++) {
          const wallet = this.createNewETHWallet(masterNode, i, NetworkStore.currentNetwork)
          wallets.push(wallet)
        }
        const walletsViaMnemonicWithBalance = await this.addBalanceToWallet(wallets)
        this.isFetchingWalletViaMnemonic = false
        this.walletsViaMnemonicMap = {
          ...this.walletsViaMnemonicMap,
          [mnemonic]: walletsViaMnemonicWithBalance
        }
        return resolve(this.walletsViaMnemonicMap)
      }, 100)
      return null
    })
  }

  validateMnemonic(mnemonic) {
    if (mnemonic.split(' ').map(String).length !== 12) {
      return false
    }
    return true
  }

  async addBalanceToWallet(wallets) {
    const balances = await Promise.all(wallets.map((w) => {
      if (w.balance > 0) {
        return w.balance
      }
      return w.getBalance()
    }))
    const walletsFormated = wallets.map((w, i) => {
      const wallet = WalletParser.parseToPlainWallet(w, i)
      wallet.balance = balances[i] === 0
        ? balances[i]
        : Starypto.Units.formatEther(balances[i])
      return wallet
    })
    return walletsFormated
  }

  checkIsWalletExist(wallets, address) {
    const isExist = wallets.find((w) => {
      return w.address === address
    })
    return isExist
  }

  createNewETHWallet(masterNode, index = 0, network = 'mainnet') {
    const childNode = masterNode.derivePathWithCoinType(Starypto.coinTypes.ETH).derive(index)
    const wallet = Starypto.fromHDNode(childNode, network)
    wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    return wallet
  }
}

const ImportWalletStore = new ObservableImportWalletStore()
export default ImportWalletStore
