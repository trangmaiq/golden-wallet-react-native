import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import InputWithAction from '../elements/InputWithActionItem'
import ActionButton from '../elements/ActionButton'
import WalletStore from '../../stores/WalletStore'
import Spinner from '../elements/Spinner'
import Checker from '../../Handler/Checker'
import LayoutUtils from '../../commons/LayoutUtils'
import commonStyle from '../../commons/commonStyles'
import BottomButton from '../elements/BottomButton'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class ImportViaAddressScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    index: PropTypes.number,
    returnData: PropTypes.func
  }

  static defaultProps = {
    index: 0,
    returnData: () => { }
  }

  state = {
    extraHeight: new Animated.Value(0),
    address: '',
    name: ''
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

  validateImport() {
    const { address } = this.state
    if (address === '') {
      NavigationStore.showPopup('Address cannot be empty')
      return false
    }
    if (!Checker.checkAddress(address) || Checker.checkAddress(address).length === 0) {
      NavigationStore.showPopup('Invalid Address')
      return false
    }
    return true
  }

  returnData(codeScanned) {
    if (this.state.name === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    const resChecker = Checker.checkAddress(codeScanned)
    if (!resChecker || resChecker.length === 0) {
      this.setState({
        address: codeScanned
      })
    } else {
      this.setState({
        address: resChecker[0]
      })
    }
  }

  canCreate = true

  render() {
    const { address, name } = this.state
    const { index, returnData } = this.props
    const loading = WalletStore.isLoadingImportAddress
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View style={[styles.container, {
              transform: [
                { translateY: this.state.extraHeight }
              ]
            }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Add your ETH Address',
                  icon: null,
                  button: images.backButton
                }}
                action={() => {
                  NavigationStore.popView()
                }}
              />
              <InputWithAction
                ref={(ref) => { this.nameField = ref }}
                style={{ width: width - 40, marginTop: isSmallScreen ? 30 : 60 }}
                placeholder="Address Name"
                value={name}
                onChangeText={(text) => {
                  this.setState({
                    name: text
                  })
                }}
              />
              <InputWithAction
                style={{ width: width - 40, marginTop: 10 }}
                placeholder="Your Address"
                onChangeText={(text) => {
                  this.setState({
                    address: text
                  })
                }}
                needPasteButton
                styleTextInput={commonStyle.fontAddress}
                value={address}
              />
              <ActionButton
                style={{ height: 40, marginTop: 30 }}
                buttonItem={{
                  name: constant.SCAN_QR_CODE,
                  icon: images.iconQrCode,
                  background: '#121734'
                }}
                styleText={{ color: AppStyle.mainTextColor }}
                styleIcon={{ tintColor: AppStyle.mainTextColor }}
                action={() => {
                  NavigationStore.navigateTo(ScreenID.ScanQRCodeScreen, {
                    title: 'Scan Address',
                    marginTop,
                    returnData: this.returnData.bind(this)
                  })
                }}
              />
            </Animated.View>
            <BottomButton
              onPress={() => {
                if (!this.canCreate) { return }
                this.canCreate = false
                const validate = this.validateImport()
                if (!validate) {
                  return
                }
                WalletStore.importWalletViaAddress(address, name).then(() => {
                  WalletStore.setSelectedIndex(index)
                  WalletStore.cacheListOriginalWallet()
                  returnData()
                  NavigationStore.showToast('Your wallet successfully imported!', { color: AppStyle.colorUp })
                  NavigationStore.popToRootView()
                }).catch((e) => {
                  this.canCreate = true
                })
              }}
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
    flex: 1,
    alignItems: 'center'
  }
})
