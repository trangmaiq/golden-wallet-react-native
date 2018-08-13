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
  Image,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import ActionButton from '../../../components/elements/ActionButton'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import NavStore from '../../../stores/NavStore'
import Checker from '../../../Handler/Checker'
import constant from '../../../commons/constant'
import AppStyle from '../../../commons/AppStyle'
import Spinner from '../../../components/elements/Spinner'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaPrivateKeyScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
    this.importPrivateKeyStore = MainStore.importStore.importPrivateKeyStore
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onChangePrivKey = (text) => {
    this.importPrivateKeyStore.setPrivateKey(text)
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
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
    this.importPrivateKeyStore.setPrivateKey(codeScanned)
  }

  _onPaste = async () => {
    const content = await Clipboard.getString()
    if (content) {
      this.importPrivateKeyStore.setPrivateKey(content)
    }
  }

  _renderPasteButton() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableOpacity
          onPress={this._onPaste}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  clearText = () => {
    this.importPrivateKeyStore.setPrivateKey('')
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

  _handleConfirm = async () => {
    const { privateKey } = this.importPrivateKeyStore
    if (privateKey === '') {
      NavStore.popupCustom.show('Private key can not be empty')
      return
    }
    if (!Checker.checkPrivateKey(privateKey)) {
      NavStore.popupCustom.show('Invalid private key')
      return
    }
    this.importPrivateKeyStore.create()
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan Private Key',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  render() {
    const { navigation } = this.props
    const { privateKey, loading } = this.importPrivateKeyStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.container, {
                transform: [
                  { translateY: this.extraHeight }
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
                  navigation.goBack()
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
                  onChangeText={this.onChangePrivKey}
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
                  action={this.gotoScan}
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
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
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
    textAlign: 'center'
  },
  actionButton: {
    width,
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  }
})
