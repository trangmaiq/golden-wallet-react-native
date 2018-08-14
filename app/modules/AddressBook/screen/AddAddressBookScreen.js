
import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  Keyboard,
  Animated,
  StyleSheet,
  SafeAreaView,
  Platform
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import ActionButton from '../../../components/elements/ActionButton'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import commonStyle from '../../../commons/commonStyles'
import BottomButton from '../../../components/elements/BottomButton'
import Checker from '../../../Handler/Checker'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()
const { height } = Dimensions.get('window')

@observer
export default class AddAddressBookScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  constructor(props) {
    super(props)
    this.traslateTop = new Animated.Value(0)
    this.addressBookStore = MainStore.addressBookStore
  }

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onChangeTitle = (text) => {
    this.addressBookStore.setTitle(text)
  }

  onChangeAddress = (text) => {
    this.addressBookStore.setAddress(text)
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

  _runTraslateTop(toValue) {
    Animated.timing(this.traslateTop, {
      toValue,
      duration: 180
    }).start()
  }

  _keyboardDidShow(e) {
    if (height <= 568) {
      this._runTraslateTop(-80)
    }
  }

  _keyboardDidHide() {
    if (height <= 568) {
      this._runTraslateTop(0)
    }
  }

  returnData(codeScanned) {
    const { addressBookStore } = this
    if (addressBookStore.name === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    let address = codeScanned
    if (this.addressBookStore.title === '') {
      setTimeout(() => this.nameField.focus(), 250)
    }
    const resChecker = Checker.checkAddress(codeScanned)
    if (resChecker && resChecker.length > 0) {
      [address] = resChecker
    }
    addressBookStore.setAddress(address)
  }

  _renderNameField = () => {
    const { title } = this.addressBookStore
    return (
      <View style={{ marginTop: 15, marginHorizontal: 20 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: AppStyle.mainFontSemiBold,
          color: AppStyle.titleDarkModeColor
        }}
        >Name
        </Text>
        <InputWithAction
          ref={(ref) => { this.nameField = ref }}
          style={{ marginTop: 10 }}
          placeholder="Address Name"
          value={title}
          onChangeText={this.onChangeTitle}
        />
      </View>
    )
  }

  _renderAddressField = () => {
    const { address } = this.addressBookStore
    return (
      <View style={{ marginTop: 20, marginHorizontal: 20 }}>
        <Text style={{
          fontSize: 16,
          fontFamily: AppStyle.mainFontSemiBold,
          color: AppStyle.titleDarkModeColor
        }}
        >Address
        </Text>
        <InputWithAction
          style={{ marginTop: 10 }}
          placeholder="Your Address"
          styleTextInput={commonStyle.fontAddress}
          onChangeText={this.onChangeAddress}
          needPasteButton
          value={address}
        />
      </View>
    )
  }

  _scanQRCodeButton() {
    return (
      <View style={{ marginTop: 20, alignSelf: 'center', flex: 1 }}>
        <ActionButton
          style={{
            height: 40
          }}
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
    )
  }

  _saveItem() {
    this.addressBookStore.saveAddressBook()
  }

  _renderSaveButton() {
    return (
      <BottomButton
        onPress={() => {
          this._saveItem()
        }}
      />
    )
  }

  render() {
    const { navigation } = this.props
    const { traslateTop } = this
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }} >
          <Animated.View
            style={[
              styles.container,
              {
                transform: [
                  {
                    translateY: traslateTop
                  }]
              }
            ]}
          >
            <NavigationHeader
              style={{ marginTop: 20 + marginTop }}
              headerItem={{
                title: 'Add New Address',
                icon: null,
                button: images.backButton
              }}
              action={() => {
                navigation.goBack()
              }}
            />
            {this._renderNameField()}
            {this._renderAddressField()}
            {this._scanQRCodeButton()}
            {this._renderSaveButton()}
          </Animated.View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  }
})
