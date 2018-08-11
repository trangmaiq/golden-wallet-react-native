import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Platform,
  TextInput,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Clipboard,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import ActionButton from '../elements/ActionButton'
import WalletStore from '../../stores/WalletStore'
import Spinner from '../elements/Spinner'
import Checker from '../../Handler/Checker'
import LayoutUtils from '../../commons/LayoutUtils'
import BottomButton from '../elements/BottomButton'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaPrivateKeyScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    returnData: PropTypes.func
  }

  static defaultProps = {
    returnData: () => { }
  }

  state = {
    extraHeight: new Animated.Value(0),
    privateKey: ''
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      this.state.extraHeight,
      {
        toValue: -toValue,
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (e.endCoordinates.screenY < 437 + marginTop) {
      this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY)
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  returnData(codeScanned) {
    this.setState({
      privateKey: codeScanned
    })
  }

  _renderPasteButton() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableOpacity
          onPress={async () => {
            const content = await Clipboard.getString()
            if (content) {
              this.setState({
                privateKey: content
              })
            }
          }}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  clearText = () => {
    this.setState({
      privateKey: ''
    })
  }

  _renderClearButton() {
    return (
      <View style={{ position: 'absolute', right: 15, top: 15 }}>
        <TouchableOpacity onPress={this.clearText}>
          <Image source={images.iconCloseSearch} />
        </TouchableOpacity>
      </View>
    )
  }

  canCreate = true

  _handleConfirm = () => {
    if (!this.canCreate) { return }
    this.canCreate = false
    const { privateKey } = this.state
    const { returnData } = this.props
    if (privateKey === '') {
      NavigationStore.showPopup('Private key can not be empty')
      return
    }
    if (!Checker.checkPrivateKey(privateKey)) {
      NavigationStore.showPopup('Invalid private key')
      return
    }
    WalletStore.importWalletViaPrivateKey(privateKey).then((res) => {
      returnData()
      NavigationStore.showToast('Your wallet successfully imported!', { color: AppStyle.colorUp })
      NavigationStore.popToRootView()
    }).catch((e) => {
      this.canCreate = true
    })
  }

  render() {
    const { privateKey } = this.state
    const loading = WalletStore.isLoadingImportPrivateKey
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.container, {
                transform: [
                  { translateY: this.state.extraHeight }
                ]
              }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Enter Your Private Key',
                  icon: null,
                  button: images.backButton
                }}
                action={() => {
                  NavigationStore.popView()
                }}
              />
              <View style={{ marginTop: 25 }}>
                <TextInput
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  multiline
                  style={[
                    styles.textInput
                  ]}
                  numberOfLines={4}
                  onChangeText={(text) => {
                    this.setState({
                      privateKey: text
                    })
                  }}
                  value={privateKey}
                />
                {privateKey === '' && this._renderPasteButton()}
                {privateKey !== '' && this._renderClearButton()}
              </View>
              <View style={styles.actionButton}>
                <ActionButton
                  style={{ height: 40, paddingHorizontal: 17 }}
                  buttonItem={{
                    name: constant.SCAN_QR_CODE,
                    icon: images.iconQrCode,
                    background: '#121734'
                  }}
                  styleText={{ color: AppStyle.mainTextColor }}
                  styleIcon={{ tintColor: AppStyle.mainTextColor }}
                  action={() => {
                    NavigationStore.navigateTo(ScreenID.ScanQRCodeScreen, {
                      title: 'Scan Private Key',
                      marginTop,
                      returnData: this.returnData.bind(this)
                    })
                  }}
                />
              </View>
            </Animated.View>
            <BottomButton
              onPress={this._handleConfirm}
            />
            {loading &&
              <Spinner />
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: AppStyle.center,
    flex: 1
  },
  textInput: {
    height: 182,
    width: width - 40,
    backgroundColor: '#14192D',
    borderRadius: 14,
    color: AppStyle.secondaryTextColor,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 18,
    paddingHorizontal: 27,
    paddingTop: 50,
    paddingBottom: 50,
    textAlign: AppStyle.center
  },
  actionButton: {
    width,
    alignItems: AppStyle.center,
    marginTop: 20,
    paddingHorizontal: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16
  }
})
