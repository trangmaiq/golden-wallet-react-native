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
  Image,
  Clipboard
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import ImportWalletStore from '../../stores/ImportWalletStore'
import Spinner from '../elements/Spinner'
import Starypto from '../../../Libs/react-native-starypto'
import LayoutUtils from '../../commons/LayoutUtils'
import BottomButton from '../elements/BottomButton'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ImportViaMnemonicScreen extends Component {
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
    mnemonic: ''
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

  _renderPasteButton() {
    return (
      <View style={{ position: 'absolute', right: 0 }}>
        <TouchableOpacity
          onPress={async () => {
            const content = await Clipboard.getString()
            if (content) {
              this.setState({
                mnemonic: content
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
      mnemonic: ''
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
    Keyboard.dismiss()
    const { returnData } = this.props
    const { mnemonic } = this.state
    if (!Starypto.validateMnemonic(mnemonic)) {
      NavigationStore.showPopup('Invalid mnemonic')
      return
    }
    ImportWalletStore.installWalletViaMnemonic(mnemonic).then((res) => {
      NavigationStore.showToast('Your wallet successfully imported!', { color: AppStyle.colorUp })
      NavigationStore.navigateTo(ScreenID.ChooseAddressScreen, {
        returnData: () => { returnData() }
      })
    }).catch((_) => {
      this.canCreate = true
      // NavigationStore.showPopup(err.message)
    })
  }

  render() {
    const {
      mnemonic, extraHeight
    } = this.state
    const loading = ImportWalletStore.isFetchingWalletViaMnemonic
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.container, {
                transform: [
                  { translateY: extraHeight }
                ]
              }]}
            >
              <NavigationHeader
                style={{ marginTop: marginTop + 20, width }}
                headerItem={{
                  title: 'Enter Mnemonic Phrases',
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
                  onChangeText={(text) => {
                    this.setState({
                      mnemonic: text
                    })
                  }}
                  value={mnemonic}
                />
                {mnemonic === '' && this._renderPasteButton()}
                {mnemonic !== '' && this._renderClearButton()}
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
    color: '#7F8286',
    fontFamily: AppStyle.mainFont,
    fontSize: 18,
    paddingHorizontal: 27,
    paddingTop: 50,
    paddingBottom: 50,
    textAlignVertical: AppStyle.center
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16
  }
})
