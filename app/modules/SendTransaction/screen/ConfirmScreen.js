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
import { observer } from 'mobx-react'
import numeral from 'numeral'
import ActionSheet from 'react-native-actionsheet'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import sendStore from '../stores/SendTransactionStore'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import HapticHandler from '../../../Handler/HapticHandler'
import Checker from '../../../Handler/Checker'
import NavigationStore from '../../../navigation/NavigationStore'
import Helper from '../../../commons/Helper'
import ScreenID from '../../../navigation/ScreenID'
import Spinner from '../../../components/elements/Spinner'
import CurrencyStore from '../../../stores/CurrencyStore'

const { height } = Dimensions.get('window')
const extraBottom = LayoutUtils.getExtraBottom()
const isIPX = height === 812

const GasWeight = [
  {
    type: 'Slow',
    value: 2
  },
  {
    type: 'Standard',
    value: 10
  },
  {
    type: 'Fast',
    value: 60
  }
]
@observer
export default class ConfirmScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  constructor(props) {
    super(props)
    this.state = {
      translateX: new Animated.Value(200),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      isShowAdvance: false,
      bottom: 0,
      marginVertical: new Animated.Value(20),
      borderRadius: 5,
      gasLimit: '',
      gasGwei: '',
      gasLimitErr: null,
      gasGweiErr: null,
      isShowClearGasLimit: true,
      isShowClearGasPrice: true,
      isDisableDone: false,
      chosenGas: 'Standard'
    }
    // FIXME: Sida can sua lai
    sendStore.setGasPrice(10)
  }

  componentWillMount() {
    sendStore.getGasPrice()
    sendStore.setGasPrice(10)
  }

  showAdvance = () => {
    const { gasLimit, gasPrice } = sendStore.getTransaction
    this.setState({
      isShowAdvance: true,
      gasLimit: `${gasLimit}`,
      gasGwei: `${gasPrice / 1000000000}`,
      gasGweiErr: '',
      gasLimitErr: '',
      isDisableDone: false
    }, () => {
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

  _renderConfirmContent(ethAmount, tokenTitle, usdAmount, from, to, fee, ratio) {
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
            {ethAmount} {tokenTitle}
          </Text>
          <Text
            style={styles.usdAmount}
          >
            ${usdAmount}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
              <Text style={{
                fontFamily: AppStyle.mainFontSemiBold,
                fontSize: 16,
                color: AppStyle.mainTextColor,
                marginRight: 12
              }}
              >
                Fee
              </Text>
              <TouchableOpacity onPress={() => {
                this.ActionSheet.show()
              }}
              >
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 30,
                  borderRadius: 15,
                  paddingHorizontal: 12,
                  backgroundColor: '#0E1428'
                }}
                >
                  <Text style={{ color: AppStyle.Color.blueActionColor }}> {this.state.chosenGas} </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text style={[styles.value, { fontFamily: AppStyle.mainFont, fontSize: 14 }]}>
              {fee} ETH {`($${numeral(fee * ratio).format('0,0.[00]')})`}
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

  _renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasGwei, tmpFee, gasLimitErr, gasGweiErr, tmpFeeUsd) {
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
              onChangeText={t => this.setState({
                gasLimit: t,
                isShowClearGasLimit: t !== '',
                gasLimitErr: '',
                isDisableDone: isNaN(Number(t))
              })}
            />
            {isShowClearGasLimit !== '' &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasLimit}
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
              onChangeText={t => this.setState({
                gasGwei: t,
                isShowClearGasPrice: t !== '',
                gasGweiErr: '',
                isDisableDone: isNaN(Number(t))
              })}
            />
            {isShowClearGasPrice !== '' &&
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={this.clearGasGwei}
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
            value={`${tmpFee} ETH ($${tmpFeeUsd})`}
            style={styles.textInput}
          />
        </View>
      </View>
    )
  }

  clearGasLimit = () => {
    this.setState({
      gasLimit: '',
      isShowClearGasLimit: false,
      gasLimitErr: '',
      isDisableDone: false
    })
  }

  clearGasGwei = () => {
    this.setState({
      gasGwei: '',
      isShowClearGasPrice: false,
      gasGweiErr: '',
      isDisableDone: false
    })
  }

  _onSend() {
    Checker.checkInternet().then((res) => {
      if (res === true) {
        NavigationStore.showModal(ScreenID.UnlockScreen, {
          runUnlock: true,
          onUnlock: () => {
            setTimeout(() => {
              if (sendStore.selectedToken.title === 'ETH') {
                this._actionSendETH()
              } else {
                this._actionSendToken()
              }
            }, 50)
          }
        }, true)
      } else {
        NavigationStore.showPopup('No internet')
      }
    })
  }

  _actionSendETH = () => {
    this.setState({
      isSending: true
    })
    sendStore.sendETH()
      .then((res) => {
        this.setState({
          isSending: false
        })
        HapticHandler.NotificationSuccess()
        NavigationStore.dismissView()
        NavigationStore.showPopup('Send success')
        setTimeout(() => {
          sendStore.clearData()
        }, 500)
      })
      .catch((err) => {
        this.setState({
          isSending: false
        })
        NavigationStore.showPopup(err.message)
      })
  }

  _actionSendToken = () => {
    this.setState({
      isSending: true
    })
    sendStore.sendToken()
      .then((res) => {
        this.setState({
          isSending: false
        })
        HapticHandler.NotificationSuccess()
        NavigationStore.dismissView()
        NavigationStore.showPopup('Send success')
        setTimeout(() => {
          sendStore.clearData()
        }, 500)
      })
      .catch((err) => {
        this.setState({
          isSending: false
        })
        NavigationStore.showPopup(err.message)
      })
  }

  _onCancel() {
    NavigationStore.dismissPopup()
    sendStore.confirmModal && sendStore.confirmModal.close()
  }

  _renderDoneBtn() {
    return (
      <TouchableOpacity
        disabled={this.state.isDisableDone}
        style={[styles.doneBtn, { borderRadius: this.state.borderRadius }]}
        onPress={() => {
          const gasLimit = Number(this.state.gasLimit)
          const gasGwei = Number(this.state.gasGwei)
          let errCount = 0
          if (Number.isNaN(gasLimit) || Number.isNaN(gasGwei)) {
            return NavigationStore.showPopup('Invalid')
          }
          if (gasLimit < 21000) {
            errCount++
            this.setState({ gasLimitErr: 'Gas limit must be greater than 21000' })
          }
          if (gasGwei <= 0) {
            errCount++
            this.setState({ gasGweiErr: 'Gas price must be greater than 0' })
          }
          if (errCount === 0) {
            sendStore.setGasLimit(gasLimit)
            sendStore.setGasPrice(gasGwei)
            sendStore.validateAmount()
            this.hideAdvance()
          } else {
            this.setState({ isDisableDone: true })
          }
          return true
        }}
      >
        <Text
          style={[styles.sendText, { color: this.state.isDisableDone ? '#8a8d97' : AppStyle.mainColor }]}
        >
          {constant.DONE}
        </Text>
      </TouchableOpacity >
    )
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
      this.state.translateY,
      {
        toValue: -toValue,
        duration: 250
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
      const extra = extraBottom === 0 ? -10 : -extraBottom
      if (isIPX) {
        // extra = -30
      }
      if (Platform.OS == 'android') {
        value += 20
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
      marginVertical,
      isShowClearGasLimit,
      isShowClearGasPrice,
      gasLimit,
      gasGwei,
      gasLimitErr,
      gasGweiErr
    } = this.state
    const { to, value } = sendStore.getTransaction
    const gas = sendStore.fee
    const tmpFee = `${(gasLimit * gasGwei) / 1000000000}`
    const rate = CurrencyStore.currencyUSD
    const tmpFeeUsd = numeral(tmpFee * rate).format('0,0.[00]')
    const eth = Helper.formatETH(value)
    const usdAmount = Helper.formatUSD(sendStore.moneyValue)
    const { title } = sendStore.selectedToken
    const { address } = sendStore.wallet
    const { isSending = false } = this.state
    return (
      <View
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.confirmContainer
          ]}
        >
          {this._renderConfirmHeader()}
          {this._renderConfirmContent(eth, title, usdAmount, address, to, gas, rate)}
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
                    {this._renderAdvanceContent(isShowClearGasLimit, isShowClearGasPrice, gasLimit, gasGwei, tmpFee, gasLimitErr, gasGweiErr, tmpFeeUsd)}
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
              {this._renderDoneBtn()}
            </Animated.View>
          </View>
        }
        {isSending &&
          <Spinner />
        }
        <ActionSheet
          ref={(ref) => { this.ActionSheet = ref }}
          title="Your transaction will process faster with a higher gas price."
          options={['Slow (2 Gwei)', 'Standard (10 Gwei)', 'Fastest (60 Gwei)', 'Cancel']}
          cancelButtonIndex={3}
          onPress={(index) => {
            if (index !== 3) {
              const gasPrice = GasWeight[index].value
              sendStore.setGasPrice(gasPrice)
            }
          }}
        />
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
    fontFamily: AppStyle.mainFontSemiBold
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
    fontFamily: AppStyle.mainFontSemiBold,
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
    fontFamily: AppStyle.mainFontBold
  },
  usdAmount: {
    fontFamily: AppStyle.mainFont,
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
    fontFamily: AppStyle.mainFontSemiBold,
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
    fontFamily: AppStyle.mainFontSemiBold,
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
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 12
  }
})
