import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import ActionButton from '../../../components/elements/ActionButton'
import Spinner from '../../../components/elements/Spinner'
import commonStyle from '../../../commons/commonStyles'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import NavStore from '../../../stores/NavStore'
import Checker from '../../../Handler/Checker'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import MainStore from '../../../AppStores/MainStore'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const marginTop = LayoutUtils.getExtraTop()

@observer
export default class ImportViaAddressScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.extraHeight = new Animated.Value(0)
    this.importAddressStore = MainStore.importStore.importAddressStore
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

  onChangeName = (text) => {
    this.importAddressStore.setTitle(text)
  }

  onChangeAddress = (text) => {
    this.importAddressStore.setAddress(text)
  }

  gotoScan = () => {
    const { navigation } = this.props
    setTimeout(() => {
      navigation.navigate('ScanQRCodeScreen', {
        title: 'Scan Address',
        marginTop,
        returnData: this.returnData.bind(this)
      })
    }, 300)
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
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

  validateImport() {
    const { address } = this.importAddressStore
    if (address === '') {
      NavStore.popupCustom.show('Address cannot be empty')
      return false
    }
    if (!Checker.checkAddress(address) || Checker.checkAddress(address).length === 0) {
      NavStore.popupCustom.show('Invalid Address')
      return false
    }
    return true
  }

  returnData(codeScanned) {
    let address = codeScanned
    if (this.importAddressStore.title === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    const resChecker = Checker.checkAddress(codeScanned)
    if (resChecker && resChecker.length > 0) {
      [address] = resChecker
    }
    this.importAddressStore.setAddress(address)
  }

  handleCreate = () => {
    const { title } = this.importAddressStore
    const validate = this.validateImport()
    if (!validate) {
      return
    }
    this.importAddressStore.create(title)
  }

  render() {
    const { address, title } = this.importAddressStore
    // const loading = WalletStore.isLoadingImportAddress
    const loading = false
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View style={[styles.container, {
              transform: [
                { translateY: this.extraHeight }
              ]
            }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: null,
                  icon: null,
                  button: images.backButton
                }}
                action={this.goBack}
              />
              <Text style={{
                width,
                paddingLeft: 20,
                marginTop: isSmallScreen ? 15 : 30,
                color: AppStyle.mainTextColor,
                fontSize: 20,
                fontFamily: 'OpenSans-Bold'
              }}
              >
                Add your ETH Address
              </Text>
              <InputWithAction
                ref={(ref) => { this.nameField = ref }}
                style={{ width: width - 40, marginTop: isSmallScreen ? 30 : 60 }}
                placeholder="Address Name"
                value={title}
                onChangeText={this.onChangeName}
              />
              <InputWithAction
                style={{ width: width - 40, marginTop: 10 }}
                placeholder="Your Address"
                onChangeText={this.onChangeAddress}
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
                action={this.gotoScan}
              />
            </Animated.View>
            <BottomButton
              onPress={this.handleCreate}
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
    flex: 1,
    alignItems: 'center'
  }
})
