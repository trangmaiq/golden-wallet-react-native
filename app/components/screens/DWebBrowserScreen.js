import React, { Component } from 'react'
import {
  StyleSheet
} from 'react-native'

import DWebBrowser from '../../../Libs/react-native-golden-dweb-browser'
import walletStore from '../../stores/WalletStore'
import navStore from '../../stores/NavStore'
import sendTxStore from '../../stores/SendTransactionStore'

export default class DWebBrowserScreen extends Component {
  onSignTransaction(data) {
    sendTxStore.setupStore({
      type: 'signTxRequest',
      rpcID: data.id,
      transaction: data.object,
      callback: callback.bind(this)
    })

    function callback(error, signedTx) {
      this.webview.executeCallback(data.id, error, signedTx)
    }

    navStore.openModal()
  }

  render() {
    const wallet = walletStore.selectedWallet
    return (
      <DWebBrowser
        ref={(ref) => { this.webview = ref }}
        style={styles.webview}
        uri="https://skylab.vn/voting2"
        network="rinkeby"
        infuraAPIKey="llyrtzQ3YhkdESt2Fzrk"
        addressHex={wallet.address}
        onSignTransaction={this.onSignTransaction.bind(this)}
      />
    )
  }
}

const styles = StyleSheet.create({
  webview: {
    flex: 1
  }
})
