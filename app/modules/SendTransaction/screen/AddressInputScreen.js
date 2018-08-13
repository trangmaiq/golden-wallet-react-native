import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  TextInput,
  Clipboard,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { observer } from 'mobx-react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import PropTypes from 'prop-types'
import Modal from '../../../../Libs/react-native-modalbox'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import ScanQRCodeScreen from './ScanQRCodeScreen'
import ChooseAddressScreen from './ChooseAddressScreen'
import ConfirmScreen from './ConfirmScreen'
import Checker from '../../../Handler/Checker'
import MainStore from '../../../AppStores/MainStore'

const { width, height } = Dimensions.get('window')
const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 20
// const isSmallScreen = height < 569
const isIPX = height === 812
// const extraTop = LayoutUtils.getExtraTop()
const extraBottom = LayoutUtils.getExtraBottom()

@observer
export default class AdressInputScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }
  static defaultProps = {
    navigation: {}
  }
  constructor(props) {
    super(props)
    this.state = {
      bottom: new Animated.Value(0 - extraBottom),
      marginVertical: new Animated.Value(20),
      extraHeight: new Animated.Value(0),
      boderRadius: new Animated.Value(5)
    }
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

  _runKeyboardAnim(toValue) {
    Animated.parallel([
      Animated.timing(
        this.state.bottom,
        {
          toValue: -toValue,
          duration: 250
        }
      ),
      Animated.timing(
        this.state.marginVertical,
        {
          toValue: toValue === extraBottom ? 20 : 0,
          duration: 250
        }
      ),
      Animated.timing(
        this.state.boderRadius,
        {
          toValue: toValue === extraBottom ? 5 : 0,
          duration: 250
        }
      )
    ]).start()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.state.extraHeight, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    this.confirm && this.confirm._keyboardDidShow(e)
    if (this.addressInput.isFocused()) {
      let value = e.endCoordinates.height
      if (e.endCoordinates.screenY < 437 + marginTop) {
        this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY)
      }
      if (isIPX) {
        value -= 34
      }
      this._runKeyboardAnim(value - 20 + extraBottom)
    }
  }

  _keyboardDidHide(e) {
    this.confirm && this.confirm._keyboardDidHide(e)
    this._runKeyboardAnim(0 + extraBottom)
    this._runExtraHeight(0)
  }

  _renderPasteButton(addressInputStore) {
    return (
      <View style={{ position: 'absolute', right: 20, top: 0 }}>
        <TouchableOpacity
          onPress={async () => {
            const content = await Clipboard.getString()
            if (content) {
              addressInputStore.setAddress(content)
              addressInputStore.validateAddress()
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
    const { addressInputStore } = MainStore.sendTransaction
    addressInputStore.setAddress('')
    addressInputStore.setDisableSend(true)
  }

  _renderClearButton() {
    return (
      <View style={{ position: 'absolute', right: 30, top: 15 }}>
        <TouchableOpacity onPress={this.clearText}>
          <Image source={images.iconCloseSearch} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderButton = () => {
    return (
      <View
        style={[styles.buttonContainer]}
      >
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss()
            const { qrCodeModal } = MainStore.sendTransaction.addressInputStore
            qrCodeModal && qrCodeModal.open()
          }}
        >
          <View
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Scan QR Code
            </Text>
            <Image source={images.icon_qrcode2} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss()
            const { addressModal } = MainStore.sendTransaction.addressInputStore
            addressModal && addressModal.open()
          }}
        >
          <View
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Address Book
            </Text>
            <Image source={images.addressIcon} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  _renderAddressModal = (addressInputStore) => {
    return (
      <Modal
        style={{
          height: isIPX ? height - 150 : height - 80,
          zIndex: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
          backgroundColor: AppStyle.backgroundColor
        }}
        swipeToClose
        onClosed={() => {

        }}
        position="bottom"
        ref={(ref) => { MainStore.sendTransaction.addressInputStore.addressModal = ref }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              height: 3,
              width: 45,
              borderRadius: 1.5,
              backgroundColor: AppStyle.secondaryTextColor,
              position: 'absolute',
              zIndex: 30,
              top: 10
            }}
          />
          <ChooseAddressScreen
            onSelectedAddress={(address) => {
              addressInputStore.setAddress(address)
              addressInputStore.validateAddress()
            }}
          />
        </View>
      </Modal>
    )
  }

  _renderQRCodeModal = () => {
    return (
      <Modal
        style={{
          height: isIPX ? height - 150 : height - 80,
          zIndex: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
          backgroundColor: AppStyle.backgroundColor
        }}
        swipeToClose
        onClosed={() => {

        }}
        position="bottom"
        ref={(ref) => { MainStore.sendTransaction.addressInputStore.qrCodeModal = ref }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              height: 3,
              width: 45,
              borderRadius: 1.5,
              backgroundColor: AppStyle.secondaryTextColor,
              position: 'absolute',
              zIndex: 30,
              top: 10
            }}
          />
          <View
            style={{
              backgroundColor: AppStyle.backgroundColor,
              flex: 1,
              justifyContent: 'center'
            }}
          >
            <ScanQRCodeScreen
              onCompleted={this._onCompleted}
            />
          </View>
        </View>
      </Modal>
    )
  }

  _onCompleted = (address) => {
    const { addressInputStore } = MainStore.sendTransaction
    const resChecker = Checker.checkAddress(address)
    if (!resChecker || resChecker.length === 0) {
      addressInputStore.setAddress(address)
      addressInputStore.validateAddress()
    } else {
      addressInputStore.setAddress(resChecker[0])
      addressInputStore.setDisableSend(!resChecker)
    }
  }

  _renderConfirmModal = () => {
    return (
      <Modal
        style={{
          height: isIPX ? 530 : 500 + extraBottom,
          zIndex: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
          backgroundColor: AppStyle.backgroundColor
        }}
        swipeToClose
        position="bottom"
        keyboardTopOffset={isIPX ? 30 : 22}
        onClosed={() => {

        }}
        ref={(ref) => { MainStore.sendTransaction.addressInputStore.confirmModal = ref }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              alignSelf: 'center',
              height: 3,
              width: 45,
              borderRadius: 1.5,
              backgroundColor: AppStyle.secondaryTextColor,
              position: 'absolute',
              zIndex: 30,
              top: 10
            }}
          />
          <View
            style={{
              backgroundColor: AppStyle.backgroundColor,
              flex: 1,
              paddingTop: 30,
              paddingBottom: isIPX ? 30 : 0
            }}
          >
            <ConfirmScreen
              ref={ref => (this.confirm = ref)}
            />
          </View>
        </View>
      </Modal>
    )
  }

  renderHeader = (value) => {
    return (
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.exit}
          onPress={() => this.props.navigation.goBack()}
        >
          <Image style={styles.exitBtn} source={images.backButton} resizeMode="contain" />
        </TouchableOpacity>
        <View
          style={styles.headerTitle}
        >
          <Text style={styles.walletName}>Amount:</Text>
          <Text style={styles.headerBalance}>{value}</Text>
        </View>
      </View>
    )
  }

  render() {
    const { addressInputStore, amountStore } = MainStore.sendTransaction
    const {
      address,
      disableSend
    } = addressInputStore

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback
          // style={{ backgroundColor: AppStyle.backgroundColor }}
          onPress={() => { Keyboard.dismiss() }}
        >
          <View
            style={styles.viewContainer}
          >
            <Animated.View
              style={[
                {
                  transform: [
                    { translateY: this.state.extraHeight }
                  ]
                }
              ]}
            >
              {this.renderHeader(amountStore.amountHeaderAddressInputScreen)}
              <View
                style={{
                  marginTop: 50
                }}
              >
                <TextInput
                  ref={ref => (this.addressInput = ref)}
                  underlineColorAndroid="transparent"
                  keyboardAppearance="dark"
                  autoCorrect={false}
                  placeholder={constant.CHOOSE_ADDRESS}
                  placeholderTextColor={AppStyle.greyTextInput}
                  multiline
                  style={[
                    styles.textInput
                  ]}
                  numberOfLines={4}
                  onChangeText={(text) => {
                    addressInputStore.setAddress(text)
                    addressInputStore.validateAddress()
                  }}
                  value={address}
                />
                {address === '' && this._renderPasteButton(addressInputStore)}
                {address !== '' && this._renderClearButton()}
              </View>
              {disableSend && address !== '' &&
                <View
                  style={styles.invalidContainer}
                >
                  <Text style={styles.invalidText}>Invalid Address</Text>
                </View>
              }
              {this._renderButton()}
            </Animated.View>
            <Animated.View
              style={[
                styles.confirm,
                {
                  transform: [
                    { translateY: this.state.bottom }
                  ],
                  left: this.state.marginVertical,
                  right: this.state.marginVertical,
                  borderRadius: this.state.boderRadius
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.confirmBtn
                ]}
                disabled={disableSend}
                onPress={() => {
                  Keyboard.dismiss()
                  addressInputStore.onConfirm()
                  // if (Checker.checkAddress(address)) {
                  //   this.confirmModal && this.confirmModal.open()
                  // }
                  const { confirmModal } = MainStore.sendTransaction.addressInputStore
                  confirmModal && confirmModal.open()
                }}
              >
                <Text style={[styles.confirmText, { color: disableSend ? '#8a8d97' : AppStyle.mainColor }]}>{constant.CONFIRM}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        {this._renderAddressModal(addressInputStore)}
        {this._renderQRCodeModal()}
        {this._renderConfirmModal()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  viewContainer: {
    flex: 1,
    paddingTop: marginTop,
    marginBottom: isIPX ? 30 : 0,
    backgroundColor: AppStyle.backgroundColor
  },
  header: {
    marginTop: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0E1428',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  walletName: {
    color: AppStyle.mainTextColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal'
  },
  headerBalance: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 18,
    color: AppStyle.mainColor,
    marginLeft: 4
  },
  exit: {
    position: 'absolute',
    left: 22,
    top: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exitBtn: {
    width: 20,
    height: 20
  },
  textInput: {
    height: 100,
    width: width - 40,
    backgroundColor: '#14192D',
    borderRadius: 5,
    color: AppStyle.secondaryTextColor,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'normal',
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 50,
    paddingLeft: 15,
    marginLeft: 20,
    marginRight: 20
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  },
  button: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    backgroundColor: '#14192D',
    borderRadius: 5,
    marginHorizontal: 20,
    marginTop: 10
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginLeft: 10
  },
  buttonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  },
  confirm: {
    backgroundColor: AppStyle.backgroundDarkBlue,
    position: 'absolute',
    height: 50,
    left: 20,
    right: 20,
    bottom: 20
  },
  confirmBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmText: {
    color: AppStyle.mainColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  line: {
    backgroundColor: AppStyle.borderLinesSetting,
    height: 1
  },
  invalidContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  },
  invalidText: {
    color: '#d0021b',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14
  }
})
