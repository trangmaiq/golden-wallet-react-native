import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WebView, View, StyleSheet, Dimensions } from 'react-native'
import NavigationHeader from '../elements/NavigationHeader'
import Spinner from '../elements/Spinner'
import images from '../../commons/images'
import NetworkStore from '../../stores/NetworkStore'
import Network from '../../Network'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default class TxHashWebViewScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    txHash: PropTypes.string
  }

  static defaultProps = {
    txHash: ''
  }
  state = {
    isShow: false
  }

  render() {
    const jsCode = `
       document.querySelector('.header').style.display = 'none';
       document.querySelector('.tibrr-cookie-consent-container').style.display = 'none';
    `
    const { txHash } = this.props
    const { currentNetwork } = NetworkStore
    let url = `https://etherscan.io/tx/${txHash}`
    if (currentNetwork !== Network.MainNet) {
      url = `https://${currentNetwork}.etherscan.io/tx/${txHash}`
    }
    const style = this.state.isShow ? { flex: 1 } : { width: 0 }
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width, marginBottom: 15 }}
          headerItem={{
            title: 'TxHash',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popView()
          }}
        />
        <WebView
          style={style}
          source={{ uri: url }}
          injectedJavaScript={jsCode}
          onLoadEnd={() => this.setState({ isShow: true })}
        />
        {!this.state.isShow && <Spinner />}
      </View>
    )
  }
}
