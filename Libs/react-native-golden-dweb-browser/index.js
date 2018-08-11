import React, { Component } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'

import PropTypes from 'prop-types'
import RNFS from 'react-native-fs'
import web3 from './web3'

let jsContent = ''

export default class GoldenDWebBrowser extends Component {
  static propTypes = {
    style: PropTypes.any,
    uri: PropTypes.string.isRequired,
    network: PropTypes.string,
    infuraAPIKey: PropTypes.string.isRequired,
    addressHex: PropTypes.string.isRequired,
    onSignTransaction: PropTypes.func, // important
    onSignMessage: PropTypes.func,
    onSignPersonalMessage: PropTypes.func,
    onSignTypedMessage: PropTypes.func
  }

  static defaultProps = {
    style: {},
    network: 'mainnet',
    onSignTransaction: (data) => { },
    onSignMessage: (data) => { },
    onSignPersonalMessage: (data) => { },
    onSignTypedMessage: (data) => { }
  }

  componentWillMount() {
    if (jsContent === '') {
      RNFS.readFile(`${RNFS.MainBundlePath}/GoldenProvider.js`, 'utf8')
        .then((content) => {
          jsContent = content
          this.setState({})
        })
    }
  }

  _onMessage(payload) {
    if (typeof payload === 'string') return
    const {
      onSignTransaction,
      onSignMessage = () => { },
      onSignPersonalMessage = () => { },
      onSignTypedMessage = () => { }
    } = this.props
    switch (payload.data.name) {
      case 'signTransaction': {
        onSignTransaction({ id: payload.data.id, object: payload.data.object })
        break
      }
      case 'signMessage': {
        onSignMessage({ id: payload.data.id, object: payload.data.object })
        break
      }
      case 'signPersonalMessage': {
        onSignPersonalMessage({ id: payload.data.id, object: payload.data.object })
        break
      }
      case 'signTypedMessage': {
        onSignTypedMessage({ id: payload.data.id, object: payload.data.object })
        break
      }
      default: break
    }
  }

  executeCallback(id, error, value) {
    const v = (typeof value === 'object') ? JSON.stringify(value) : `${value}`
    const e = error ? `'${error}'` : 'null'
    this.webview.evaluateJavaScript(`executeCallback(${id}, ${e}, '${v}')`)
  }

  test() {
    this.webview.evaluateJavaScript(`alert(typeof executeCallback)`)
  }

  render() {
    const {
      style,
      uri,
      addressHex,
      network,
      infuraAPIKey = 'llyrtzQ3YhkdESt2Fzrk'
    } = this.props

    return (
      <View style={[styles.container, style]}>
        {/* {jsContent && <WKWebView
          ref={(ref) => { this.webview = ref }}
          source={{ uri }}
          onMessage={(e) => { this._onMessage(e.nativeEvent) }}
          injectJavaScript={getJavascript(addressHex, network, infuraAPIKey)}
          injectJavaScriptForMainFrameOnly={true}
          mixedContentMode="compatibility"
          javaScriptEnabled={true}
          style={styles.webView}
        />} */}
      </View>
    )
  }
}

const getJavascript = function (addressHex, network, infuraAPIKey) {
  return `
    ${jsContent}
    ${web3}

    function getChainID(name) {
      switch(name) {
        case 'mainnet': return 1;
        case 'ropsten': return 3;
        case 'rinkeby': return 4;
        case 'kovan': return 42;
      }

      throw new Error('Unsupport network')
    }

    function getInfuraRPCURL(chainID, apiKey) {
      switch(chainID) {
        case 1: return 'https://mainnet.infura.io/' + apiKey;
        case 3: return 'https://ropsten.infura.io/' + apiKey;
        case 4: return 'https://rinkeby.infura.io/' + apiKey;
        case 42: return 'https://kovan.infura.io/' + apiKey;
      }

      throw new Error('Unsupport network')
    }

    function getInfuraWSSURL(chainID, apiKey) {
      switch(chainID) {
        case 1: return 'wss://mainnet.infura.io/ws/' + apiKey;
        case 3: return 'wss://ropsten.infura.io/ws/' + apiKey;
        case 4: return 'wss://rinkeby.infura.io/ws/' + apiKey;
        case 42: return 'wss://kovan.infura.io/ws/' + apiKey;
      }

      throw new Error('Unsupport network')
    }

    let infuraAPIKey = '${infuraAPIKey}';
    let addressHex = '${addressHex}';
    let network = '${network}';
    let chainID = getChainID(network);
    let rpcUrl = getInfuraRPCURL(chainID, infuraAPIKey);
    let wssUrl = getInfuraWSSURL(chainID, infuraAPIKey);

    function executeCallback (id, error, value) {
      goldenProvider.executeCallback(id, error, value)
    }

    let goldenProvider = null

    function init() {
      goldenProvider = new Golden({
        noConflict: true,
        address: addressHex,
        networkVersion: chainID,
        rpcUrl,
        wssUrl,
        getAccounts: function (cb) {
          cb(null, [addressHex]) 
        },
        signTransaction: function (tx, cb){
          console.log('signing a transaction', tx)
          const { id = 8888 } = tx
          goldenProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signTransaction", "object": tx, id: id})
        },
        signMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a message", msgParams)
          goldenProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signMessage", "object": { data }, id: id})
        },
        signPersonalMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a personal message", msgParams)
          goldenProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signPersonalMessage", "object": { data }, id: id})
        },
        signTypedMessage: function (msgParams, cb) {
          const { data } = msgParams
          const { id = 8888 } = msgParams
          console.log("signing a typed message", msgParams)
          goldenProvider.addCallback(id, cb)
          window.webkit.messageHandlers.reactNative.postMessage({"name": "signTypedMessage", "object": { data }, id: id})
        }
      },
      {
        address: addressHex,
        networkVersion: chainID
      })
    }
    
    init();
    window.web3 = new Web3(goldenProvider)

    web3.eth.defaultAccount = addressHex
  
    web3.setProvider = function () {
      console.debug('Golden Wallet - overrode web3.setProvider')
    }

    web3.version.getNetwork = function(cb) {
      cb(null, chainID)
    }
    web3.eth.getCoinbase = function(cb) {
      return cb(null, addressHex)
    }
  `
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  webView: {
    flex: 1
  }
})
