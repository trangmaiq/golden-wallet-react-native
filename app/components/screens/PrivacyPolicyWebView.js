import React, { Component } from 'react'
import {
  WebView,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import LayoutUtils from '../../commons/LayoutUtils'

import NavigationStore from '../../navigation/NavigationStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default class PrivacyPolicyWebView extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  state = {
    isShow: false
  }

  render() {
    // const jsCode = `
    //    document.querySelector('.header').style.display = 'none';
    //    document.querySelector('.tibrr-cookie-consent-container').style.display = 'none';
    // `
    const url = 'https://goldenwallet.co/privacy'
    const style = this.state.isShow ? { flex: 1 } : { width: 0 }
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: null,
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
          onLoadEnd={() => this.setState({ isShow: true })}
        />
      </View>
    )
  }
}
