
import React, { Component } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  Keyboard,
  Animated,
  StyleSheet,
  Platform
} from 'react-native'
import PropsType from 'prop-types'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import ContactStore from '../../stores/ContactStore'
import Checker from '../../Handler/Checker'
import LayoutUtils from '../../commons/LayoutUtils'
import constant from '../../commons/constant'
import ActionButton from '../elements/ActionButton'
import InputWithAction from '../elements/InputWithActionItem'
import commonStyle from '../../commons/commonStyles'
import ScreenID from '../../navigation/ScreenID'
import NavigationStore from '../../navigation/NavigationStore'
import BottomButton from '../elements/BottomButton'

const marginTop = LayoutUtils.getExtraTop()
const extraBottom = LayoutUtils.getExtraBottom()
const { height } = Dimensions.get('window')

export default class AddContactScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    item: PropsType.object,
    index: PropsType.number,
    returnData: PropsType.func,
    setNewHeightContactList: PropsType.func
  }

  static defaultProps = {
    item: null,
    index: 0,
    returnData: () => {},
    setNewHeightContactList: () => {}
  }

  constructor(props) {
    super(props)
    this.marginBottom = 20 + extraBottom
    this.state = {
      name: '',
      address: '',
      traslateTop: new Animated.Value(0)
    }
    if (props.item) {
      this.currentIndex = props.index
      const {
        name,
        address
      } = props.item
      this.state.name = name
      this.state.address = address
    }
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

  _runTraslateTop(toValue) {
    Animated.timing(this.state.traslateTop, {
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

  _renderNameField = () => {
    const { name } = this.state

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
          value={name}
          onChangeText={(text) => {
            this.setState({
              name: text
            })
          }}
        />
      </View>
    )
  }

  _renderAddressField = () => {
    const { address } = this.state

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
          onChangeText={(text) => {
            this.setState({
              address: text
            })
          }}
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
          action={() => {
            NavigationStore.navigateTo(ScreenID.ScanQRCodeScreen, {
              title: 'Scan Address',
              marginTop,
              returnData: this.returnData.bind(this)
            })
          }}
        />
      </View>
    )
  }

  _saveItem(returnData, setNewHeightContactList) {
    const {
      name,
      address
    } = this.state
    const addressParser = Checker.checkAddress(address)
    if (!addressParser || addressParser.length === 0) {
      NavigationStore.showPopup('Invalid address')
      return
    }
    const resAddress = addressParser[0]
    if (name === '') {
      NavigationStore.showPopup('Name cannot null')
      return
    }

    try {
      if (!this.item) {
        const contacts = ContactStore.contacts.slice()
        const filterContact = contacts.filter(contact => contact.address === resAddress)
        if (filterContact.length > 0) {
          NavigationStore.showPopup('Existing wallet')
          return
        }
        ContactStore.addContact({ name, address: resAddress })
      } else {
        ContactStore.editContact({ name, address: resAddress }, this.currentIndex)
      }
      returnData(resAddress)
      setNewHeightContactList()
      NavigationStore.popView()
    } catch (_) {
      NavigationStore.showPopup('Cannot save this contact')
    }
  }

  _renderSaveButton() {
    const { returnData = () => { }, setNewHeightContactList = () => { } } = this.props
    return (
      <BottomButton
        onPress={() => {
          this._saveItem(returnData, setNewHeightContactList)
        }}
      />
    )
  }

  render() {
    const { traslateTop } = this.state
    return (
      <View style={{ flex: 1 }}>
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
                NavigationStore.popView()
              }}
            />
            {this._renderNameField()}
            {this._renderAddressField()}
            {this._scanQRCodeButton()}
            {this._renderSaveButton()}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  }
})
