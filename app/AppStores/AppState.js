import Config from './Stores/Config'
import Constants from '../commons/constant'

// Current app state
class AppState {
  dataVersion = '1'
  config = new Config('mainnet', Constants.INFURA_API_KEY)
  defaultWallet = null // for web3 dapp
  selectedWallet = null // for sending transaction
  selectedToken = null // for sending transaction
  wallets = []
  addressBooks = []
  rateETHDollar = 412.0

  // for local storage: be careful with MobX observable
  toJSON() {
    const walletsJS = this.wallets.map(w => w.toJSON())
    const addressBooksJS = addressBooks.map(adr => adr.toJSON())

    return {
      dataVersion,
      config: config.toJSON(),
      defaultWallet: defaultWallet ? defaultWallet.toJSON() : null,
      selectedWallet: selectedWallet ? selectedWallet.toJSON() : null,
      selectedToken: selectedToken ? selectedToken.toJSON() : null,
      wallets: walletsJS,
      addressBooks: addressBooksJS,
      rateETHDollar
    }
  }
}