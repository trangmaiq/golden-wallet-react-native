import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WebView, View, StyleSheet, Dimensions } from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import Spinner from '../../../components/elements/Spinner'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: marginTop + 10,
  }
})

export default class TxHashWebViewScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }
  state = {
    isShow: false
  }

  render() {
    const { navigation } = this.props
    const jsCode = `
       document.querySelector('.header').style.display = 'none';
       document.querySelector('.tibrr-cookie-consent-container').style.display = 'none';
    `
    const { txHash } = navigation.state.params
    // const { currentNetwork } = NetworkStore
    const url = `https://etherscan.io/tx/${txHash}`
    // if (currentNetwork !== Network.MainNet) {
    //   url = `https://${currentNetwork}.etherscan.io/tx/${txHash}`
    // }
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
            navigation.goBack()
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
