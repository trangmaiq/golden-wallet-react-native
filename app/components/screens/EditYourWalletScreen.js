import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image
} from 'react-native'
import PropsType from 'prop-types'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import NavigationHeader from '../elements/NavigationHeader'
import InputWithActions from '../elements/InputWithActionItem'
import SmallCardItem from '../elements/SmallCardItem'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'
import WalletStore from '../../stores/WalletStore'
import Helper from '../../commons/Helper'
import NavigationStore from '../../navigation/NavigationStore'

const marginTop = getStatusBarHeight()
const { width } = Dimensions.get('window')

export default class EditYourWalletScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  constructor(props) {
    super(props)
    this.state = {
      textName: null,
      onBackgroundColor: null,
      bottom: new Animated.Value(0),
      extraHeight: new Animated.Value(0)
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
    // if (!isNaN(this.state.bottom)) return

    // this.setState({bottom: toValue})
    Animated.timing(
      // Animate value over time
      this.state.bottom, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250,
        useNativeDriver: true
      }
    ).start()
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
    const value = Platform.OS === 'ios' ? e.endCoordinates.height : 0
    if (e.endCoordinates.screenY < 606 + marginTop) {
      this._runExtraHeight(606 + marginTop - e.endCoordinates.screenY)
    }
    this._runKeyboardAnim(value)
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(0)
    this._runExtraHeight(0)
  }

  renderButtonBackground = (color, margin) => {
    return (
      <TouchableOpacity
        style={[{ marginLeft: margin }]}
        onPress={() => {
          this.setState({ onBackgroundColor: color })
        }}
      >
        <View
          style={[styles.buttonBackground, { backgroundColor: AppStyle[color] }]}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { navigation } = this.props
    const { wallet, index } = navigation.state.params
    const {
      cardName,
      address,
      background,
      balanceValue,
      balanceUSDValue
    } = wallet
    return (
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => { Keyboard.dismiss() }}
      >
        <View style={styles.container}>
          <Animated.View style={{
            transform: [
              { translateY: this.state.extraHeight }
            ]
          }}
          >
            <NavigationHeader
              headerItem={{
                title: 'Edit your wallet',
                icon: null,
                button: images.closeButton
              }}
              action={() => this.props.navigation.goBack()}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <SmallCardItem
                style={{ height: 176 }}
                backgroundStyle={{ height: 170, width: width - 40 }}
                numberEther={Helper.formatCommaNumber(balanceValue)}
                dollaEther={Helper.formatCommaNumber(balanceUSDValue)}
                name={this.state.textName || cardName}
                token={address}
                iconStyle={{ width: 50, height: 82, tintColor: AppStyle.alphaColorImage }}
                icon={images.iconEther}
                background={this.state.onBackgroundColor || background}
                onPress={() => { }}
                disabled
              />
              <Text style={styles.textName}>
                {constant.NAME}
              </Text>
              <InputWithActions
                placeholder="name"
                style={{ height: 54, borderRadius: 5, marginTop: 10 }}
                onChangeText={(text) => {
                  this.setState({ textName: text })
                }}
                value={this.state.textName}
              />
              <Text style={[styles.textName, { marginTop: 20 }]}>
                {constant.COLOR}
              </Text>
              <View style={styles.viewButton}>
                {this.renderButtonBackground('mode1', 0)}
                {this.renderButtonBackground('mode2', 10)}
                {this.renderButtonBackground('mode3', 10)}
              </View>
            </View>
          </Animated.View>
          <Animated.View style={{
            position: 'absolute',
            bottom: marginTop ? 20 : 15,
            left: 20,
            transform: [
              { translateY: this.state.bottom }
            ]
          }}
          >
            <View style={styles.viewButtonBottom}>
              <TouchableOpacity
                style={styles.buttonBlue}
                onPress={() => {
                  const walletEdited = {
                    ...wallet,
                    balance: wallet.balanceValue,
                    cardName: this.state.textName || cardName,
                    background: this.state.onBackgroundColor || background
                  }
                  WalletStore.editWallet(walletEdited, index)
                    .then(() => navigation.goBack())
                    .catch(e => () => { })
                }}
              >
                <Image
                  source={images.backgroundLargeButton}
                  style={{ position: 'absolute', borderRadius: 5, width: width - 40 }}
                />
                <Text style={styles.textSave}>
                  {constant.SAVE}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonWhite}
                onPress={() => {
                  NavigationStore.showBinaryPopup(
                    'Are you sure you want to remove this wallet?',
                    {
                      firstAction: {
                        title: 'Cancel',
                        action: () => { }
                      },
                      secondAction: {
                        title: 'Delete',
                        action: () => {
                          WalletStore.removeWallet(index)
                          NavigationStore.popView()
                        }
                      }
                    }
                  )
                }}
              >
                <Text style={[styles.textRemove, { color: AppStyle.colorPink }]}>
                  Remove this wallet
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View >
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10 + marginTop
  },
  textName: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.mainTextColor,
    marginTop: 30
  },
  buttonBackground: {
    borderRadius: 3.4,
    width: 40,
    height: 40
  },
  viewButton: {
    flexDirection: 'row',
    marginTop: 20
  },
  viewButtonBottom: {
    alignSelf: 'center'
  },
  buttonBlue: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonWhite: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: AppStyle.colorDown,
    marginTop: 10,
    borderWidth: 1
  },
  textSave: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18,
    color: AppStyle.mainColor
  },
  textRemove: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18,
    color: AppStyle.colorDown
  }
})
