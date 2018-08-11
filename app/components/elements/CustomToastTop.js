import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const { width } = Dimensions.get('window')

export default class CreateWalletScreen extends Component {
  static propTypes = {
    content: PropTypes.string,
    styleText: PropTypes.object,
    style: PropTypes.object,
    information: PropTypes.object
  }

  static defaultProps = {
    content: 'Gáy lên',
    styleText: {},
    style: {},
    information: {}
  }

  render() {
    const {
      content,
      styleText,
      style,
      information
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            if (information) {
              NavigationStore.navigateTo(ScreenID.TransactionDetailScreen, information)
            }
          }}
        >
          <View style={{
            flex: 1,
            alignItems: AppStyle.Align.center,
            justifyContent: AppStyle.Align.flexEnd
          }}
          >
            <Text style={[styles.copyText, styleText]}>{content}</Text>
          </View>

        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: isIphoneX() ? 100 : 80,
    backgroundColor: AppStyle.Color.backgroundToast
  },

  copyText: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.mainColor,
    marginBottom: 10
  }
})
