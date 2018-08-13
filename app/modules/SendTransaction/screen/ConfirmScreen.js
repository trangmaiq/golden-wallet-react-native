import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import { observer } from 'mobx-react'
import numeral from 'numeral'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
// import WalletStore from '../../../stores/WalletStore'
import NavStore from '../../../stores/NavStore'
import HapticHandler from '../../../Handler/HapticHandler'
import Checker from '../../../Handler/Checker'
import Helper from '../../../commons/Helper'
import MainStore from '../../../AppStores/MainStore'

const { height } = Dimensions.get('window')
const extraBottom = LayoutUtils.getExtraBottom()
const isIPX = height === 812

@observer
export default class ConfirmScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      translateX: new Animated.Value(200),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      isShowAdvance: false,
      bottom: 0,
      marginVertical: new Animated.Value(20),
      borderRadius: 5
    }
  }

  componentWillMount() {
    MainStore.sendTransaction.confirmStore.estimateGas()
    MainStore.sendTransaction.confirmStore.validateAmount()
  }

  showAdvance = () => {
    MainStore.sendTransaction.confirmStore._onShowAdvance()
    this.setState({ isShowAdvance: true }, () => {
      Animated.parallel([
        Animated.timing(
          this.state.translateX,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }
        ),
        Animated.timing(
          this.state.opacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }
        )
      ]).start()
    })
  }

  hideAdvance = () => {
    Animated.parallel([
      Animated.timing(
        this.state.translateX,
        {
          toValue: 200,
          duration: 200,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }
      )
    ]).start()
    setTimeout(() => this.setState({ isShowAdvance: false }), 200)
  }

  _renderConfirmHeader() {
    return (
      <View
        style={styles.confirmHeader}
      >
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => this._onCancel()}
        >
          <Image source={images.closeButton} style={styles.closeIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Confirmation</Text>
        <TouchableOpacity
          style={styles.advanceBtn}
          onPress={() => this.showAdvance()}
        >
          <Image source={images.advanceIcn} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderConfirmContent(ethAmount, usdAmount, from, to, fee) {
    return (
      <View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 20
          }}
        >
          <Text
            style={styles.amount}
          >
            {ethAmount}
          </Text>
          <Text
            style={styles.usdAmount}
          >
            {usdAmount}
          </Text>
        </View>
        <View>
          <View style={styles.item}>
            <Text style={styles.key}>
              From
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.value}
            >
              {from}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.item}>
            <Text style={styles.key}>
              To
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={styles.value}
            >
              {to}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.item}>
            <Text style={styles.key}>
              Fee
            </Text>
            <Text style={[styles.value, { fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular', fontSize: 14 }]}>
              {fee}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  _renderSendBtn() {
    return (
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => {
          this._onSend()
          // sendStore.estimateGas()
        }}
      >
        <Text style={styles.sendText}>{constant.SEND}</Text>
      </TouchableOpacity>
    )
  }

  _renderAdvanceHeader() {
    return (
      <View
        style={styles.confirmHeader}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => this.hideAdvance()}
        >
          <Image source={images.backButton} style={styles.backIcon} />
          <Text style={[styles.title]}>Advance</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasGwei, tmpFee, gasLimitErr, gasGweiErr, advanceStore) {
    return (
      <View>
        <View
          style={[styles.item, { marginTop: 20, marginBottom: 50 }]}
        >
          <Text
            style={styles.key}
          >
            Gas Limit
          </Text>
          <View>
            <TextInput
              ref={ref => (this.gasLimit = ref)}
              style={styles.textInput}
              keyboardAppearance="dark"
              value={gasLimit}
              keyboardType="numeric"
              onChangeText={(t) => {
                advanceStore.setGasLimit(t)
                advanceStore.setGasLimitErr('')
                advanceStore.setDisableDone(false)
                // this.setState({ gasLimit: t, isShowClearGasLimit: t !== '', gasLimitErr: '', isDisableDone: false })
              }}
            />
            {isShowClearGasLimit &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasLimit(advanceStore)}
              >
                <Image source={images.iconCloseSearch} style={styles.iconClear} />
              </TouchableOpacity>}
            {gasLimitErr !== '' &&
              <Text
                style={styles.err}
              >
                {gasLimitErr}
              </Text>}
          </View>
          <Text
            style={styles.key}
          >
            Gas Price (Gwei)
          </Text>
          <View>
            <TextInput
              ref={ref => (this.gasGwei = ref)}
              keyboardType="numeric"
              keyboardAppearance="dark"
              value={gasGwei}
              style={styles.textInput}
              onChangeText={(t) => {
                advanceStore.setGasPrice(t)
                advanceStore.setGasPriceErr('')
                advanceStore.setDisableDone(false)
                // this.setState({ gasGwei: t, isShowClearGasPrice: t !== '', gasGweiErr: '', isDisableDone: false })
              }}
            />
            {isShowClearGasPrice &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasGwei(advanceStore)}
              >
                <Image source={images.iconCloseSearch} style={styles.iconClear} />
              </TouchableOpacity>}
            {gasGweiErr !== '' &&
              <Text
                style={styles.err}
              >
                {gasGweiErr}
              </Text>}
          </View>
          <Text
            style={styles.key}
          >
            Fee (Gas Limit * Gas Price)
          </Text>
          <TextInput
            editable={false}
            keyboardAppearance="dark"
            ref={ref => (this.fee = ref)}
            value={`${tmpFee}`}
            style={styles.textInput}
          />
        </View>
      </View>
    )
  }

  clearGasLimit = (advanceStore) => {
    advanceStore.setGasLimit('')
    advanceStore.setGasLimitErr('')
    advanceStore.setDisableDone(false)
    // this.setState({ gasLimit: '', isShowClearGasLimit: false, gasLimitErr: '', isDisableDone: false })
  }

  clearGasGwei = (advanceStore) => {
    advanceStore.setGasPrice('')
    advanceStore.setGasPriceErr('')
    advanceStore.setDisableDone(false)
    // this.setState({ gasGwei: '', isShowClearGasPrice: false, gasGweiErr: '', isDisableDone: false })
  }

  _onSend(advanceStore) {
    MainStore.sendTransaction.sendTx()
    // NavStore.showLoading()
    // Checker.checkInternet().then((res) => {
    //   if (res === true) {
    //     if (sendStore.selectedToken.title === 'ETH') {
    //       this._actionSendETH()
    //     } else {
    //       this._actionSendToken()
    //     }
    //   } else {
    //     NavStore.hideLoading()
    //     NavStore.popupCustom.show(
    //       'No internet',
    //       [
    //         {
    //           text: 'Ok',
    //           onClick: () => {
    //             NavStore.popupCustom.hide()
    //           }
    //         }
    //       ]
    //     )
    //   }
    // })
  }

  // _actionSendETH() {
  //   sendStore.sendETH()
  //     .then((res) => {
  //       console.log('Done: ', res)
  //       HapticHandler.NotificationSuccess()
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.popupCustom.show('Send success')
  //       setTimeout(() => {
  //         sendStore.clearData()
  //       }, 500)
  //     })
  //     .catch((err) => {
  //       NavStore.popupCustom.show(err.message)
  //     })
  // }

  // _actionSendToken() {
  //   sendStore.sendToken()
  //     .then((res) => {
  //       console.log('Done: ', res)
  //       HapticHandler.NotificationSuccess()
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.navigator.dispatch(NavigationActions.back())
  //       NavStore.popupCustom.show('Send success')
  //       setTimeout(() => {
  //         sendStore.clearData()
  //       }, 500)
  //     })
  //     .catch((err) => {
  //       NavStore.popupCustom.show(err.message)
  //     })
  // }

  _onCancel() {
    NavStore.popupCustom.hide()
    MainStore.sendTransaction.addressInputStore.confirmModal && MainStore.sendTransaction.addressInputStore.confirmModal.close()
  }

  _renderDoneBtn(advanceStore) {
    return (
      <TouchableOpacity
        disabled={this.state.isDisableDone}
        style={[styles.doneBtn, { borderRadius: this.state.borderRadius }]}
        onPress={this._onDone}
      >
        <Text
          style={[styles.sendText, { color: advanceStore.isDisableDone ? '#8a8d97' : AppStyle.mainColor }]}
        >
          {constant.DONE}
        </Text>
      </TouchableOpacity >
    )
  }

  _onDone = () => {
    const { advanceStore } = MainStore.sendTransaction
    const gasLimit = Number(advanceStore.gasLimit)
    const gasPrice = Number(advanceStore.gasPrice)
    let errCount = 0
    if (Number.isNaN(gasLimit) || Number.isNaN(gasPrice)) {
      return NavStore.popupCustom.show(
        'Invalid number',
        [
          {
            text: 'Ok',
            onClick: () => {
              NavStore.popupCustom.hide()
            }
          }
        ]
      )
    }
    if (gasLimit < 21000) {
      errCount++
      advanceStore.setGasLimitErr('Gas limit must be greater than 21000')
    }
    if (gasPrice <= 0) {
      errCount++
      advanceStore.setGasPriceErr('Gas price must be greater than 0')
    }
    if (errCount === 0) {
      // sendStore.setGasLimit(gasLimit)
      // sendStore.setGasPrice(gasGwei)
      // sendStore.validateAmount()
      // TODO Done
      this.hideAdvance()
    } else {
      // this.setState({ isDisableDone: true })
      advanceStore.setDisableDone(true)
    }
    advanceStore._onDone()
    return true
  }

  _runKeyboardAnim(toValue) {
    Animated.parallel([
      Animated.timing(
        this.state.marginVertical,
        {
          toValue: toValue === 0 ? 20 : 0,
          duration: 250
        }
      )
    ]).start()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      // Animate value over time
      this.state.translateY, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250
        // useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (this.gasLimit.isFocused() || this.gasGwei.isFocused()) {
      let value = 500 + e.endCoordinates.height - height
      if (isIPX) {
        // value += 10
      }
      this.setState({ bottom: value + 20, borderRadius: 0 })
      let extra = extraBottom === 0 ? -10 : -extraBottom
      if (isIPX) {
        // extra = -30
      }
      this._runExtraHeight(value > 0 ? value : extra)
      this._runKeyboardAnim(value - 20)
    }
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(0)
    this._runExtraHeight(0)
    this.setState({ bottom: 0, borderRadius: 5 })
  }

  render() {
    const {
      translateX,
      translateY,
      opacity,
      isShowAdvance,
      bottom,
      marginVertical
    } = this.state
    const { advanceStore, confirmStore } = MainStore.sendTransaction
    const {
      isShowClearGasLimit,
      isShowClearGasPrice,
      gasLimit,
      gasPrice,
      gasLimitErr,
      gasGweiErr,
      formatedTmpFee
    } = advanceStore
    const {
      formatedFee,
      formatedAmount,
      formatedDolar
    } = confirmStore
    const to = MainStore.sendTransaction.address
    // const tmpFee = `${(gasLimit * gasGwei) / 1000000000}`
    // const wallet = sendStore.getWallet
    // console.log('wallet', wallet)
    // const { ratio } = sendStore.wallet
    // const tmpFeeUsd = numeral(tmpFee * ratio).format('0,0.[00]')
    // const eth = Helper.formatETH(value)
    // const usdAmount = Helper.formatUSD(value * ratio)
    const { address } = MainStore.appState.selectedWallet
    // const address = '0x0ai00a0a0a0'
    return (
      <View
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.confirmContainer,
            {
            }
          ]}
        >
          {this._renderConfirmHeader()}
          {this._renderConfirmContent(formatedAmount, formatedDolar, address, to, formatedFee)}
          {this._renderSendBtn()}
        </Animated.View>
        {isShowAdvance &&
          <View
            style={[styles.advanceContainer]}
          >
            <Animated.View
              style={[
                { flex: 1, backgroundColor: AppStyle.backgroundColor },
                {
                  transform: [
                    { translateX }
                  ],
                  opacity
                }
              ]}
            >
              <ScrollView
                style={{ marginBottom: bottom }}
              >
                <TouchableWithoutFeedback
                  onPress={() => Keyboard.dismiss()}
                >
                  <View style={{ flex: 1 }}>
                    {this._renderAdvanceHeader()}
                    {this._renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasPrice, formatedTmpFee, gasLimitErr, gasGweiErr, advanceStore)}
                    {/* {this._renderDoneBtn()} */}
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </Animated.View>
            <Animated.View
              style={[
                {
                  transform: [
                    { translateY }
                  ],
                  paddingLeft: marginVertical,
                  paddingRight: marginVertical,
                  bottom: extraBottom !== 0 ? extraBottom : 20,
                  backgroundColor: AppStyle.backgroundColor
                }
              ]}
            >
              {this._renderDoneBtn(advanceStore)}
            </Animated.View>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  confirmContainer: {
    flex: 1
  },
  advanceContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
    // backgroundColor: AppStyle.backgroundColor
  },
  confirmHeader: {
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeIcon: {
    width: 20,
    height: 20
  },
  title: {
    color: '#E5E5E5',
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  closeBtn: {
    marginLeft: 20,
    padding: 5
  },
  advanceBtn: {
    marginRight: 20
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  key: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.mainTextColor,
    marginTop: 15
  },
  value: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNew',
    fontSize: 16,
    color: AppStyle.secondaryTextColor,
    marginTop: 10,
    marginBottom: 15
  },
  item: {
    paddingLeft: 20,
    paddingRight: 20
  },
  amount: {
    color: '#E4BF43',
    fontSize: 30,
    fontFamily: 'OpenSans-Bold'
  },
  usdAmount: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 20,
    color: AppStyle.secondaryTextColor
  },
  sendBtn: {
    position: 'absolute',
    backgroundColor: AppStyle.backgroundDarkBlue,
    borderRadius: 5,
    bottom: extraBottom !== 0 ? extraBottom : 20,
    left: 20,
    right: 20,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18
  },
  textInput: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#14192d',
    alignSelf: 'stretch',
    marginTop: 10,
    color: AppStyle.secondaryTextColor,
    paddingLeft: 10,
    fontFamily: 'OpenSans-Semibold',
    paddingRight: 10,
    fontSize: 14
  },
  textArea: {
    height: 80,
    backgroundColor: '#14192d',
    borderRadius: 5,
    alignSelf: 'stretch',
    marginTop: 10,
    color: AppStyle.secondaryTextColor,
    paddingLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    paddingRight: 10,
    fontSize: 14
  },
  doneBtn: {
    backgroundColor: AppStyle.backgroundDarkBlue,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  line: {
    height: 1,
    backgroundColor: '#14192D',
    marginLeft: 20,
    marginRight: 20
  },
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 19
  },
  err: {
    color: 'red',
    marginTop: 10,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 12
  }
})
