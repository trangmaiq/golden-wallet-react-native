import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  WebView,
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default class PrivacyPolicyWebView extends Component {
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
    const url = `https://goldenwallet.co/privacy`
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
            navigation.goBack()
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
