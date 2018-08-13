import Helper from '../commons/Helper'
import CurrencyStore from '../stores/CurrencyStore'
import Starypto from './../../Libs/react-native-starypto'
import NetworkStore from '../stores/NetworkStore'

class WalletParser {
  /**
   *
   * @param {Object} originWallet
   * @param {Int} index
   * @param {String} importType
   */
  static parseToPlainWallet(originWallet, index, importType) {
    const w = originWallet
    const walletFormat = {
      background: w.background || 'mode1',
      cardName: w.cardName || `My wallet ${index}`,
      balance: `${(w.balance && w.balance > 0)
        ? Helper.formatETH(w.balance)
        : 0} ETH`,
      balanceValue: (w.balance && w.balance > 0) ? w.balance : 0,
      balanceUSD: (w.balance && w.balance > 0)
        ? `$${Helper.formatUSD(w.balance * CurrencyStore.currencyUSD)}`
        : `$0`,
      balanceUSDValue: (w.balance && w.balance > 0)
        ? w.balance * CurrencyStore.currencyUSD
        : 0,
      address: w.address || w.provider.address,
      privateKey: w.privateKey || '',
      enableSecretBalance: w.enableSecretBalance !== undefined ? w.enableSecretBalance : true,
      enableSmallAssets: w.enableSmallAssets !== undefined ? w.enableSmallAssets : true,
      importType: w.importType || importType
    }
    return walletFormat
  }

  /**
   *
   * @param {Object} plainWallet
   */
  static parseToOriginWallet(plainWallet) {
    let orginalWallet = plainWallet
    if (!plainWallet.privateKey) {
      orginalWallet = new Starypto.Wallet({ coinType: Starypto.coinTypes.ETH, network: NetworkStore.currentNetwork }, null, plainWallet.address)
    } else {
      orginalWallet = Starypto.fromPrivateKey(plainWallet.privateKey, Starypto.coinTypes.ETH, NetworkStore.currentNetwork)
    }
    orginalWallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
    orginalWallet.balance = plainWallet.balance
    orginalWallet.balanceValue = parseFloat(plainWallet.balance)
    return orginalWallet
  }
}

export default WalletParser
