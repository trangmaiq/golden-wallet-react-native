import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated
} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { observer, PropTypes } from 'mobx-react/native'
import debounce from 'lodash.debounce'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import Modal from '../../../../Libs/react-native-modalbox'
import constant from '../../../commons/constant'
import KeyboardButton from '../elements/KeyboardButton'
import AnimationInput from '../elements/AnimationInput'
import sendTransactionStore from '../stores/SendTransactionStore'
import SelectedCoinScreen from './SelectedCoinScreen'
import WalletStore from '../../../stores/WalletStore'
import Starypto from '../../../../Libs/react-native-starypto'
import Helper from '../../../commons/Helper'
import HapticHandler from '../../../Handler/HapticHandler'
import NavigationStore from '../../../navigation/NavigationStore'
import ScreenID from '../../../navigation/ScreenID'
import NetworkStore from '../../../stores/NetworkStore'
import Network from '../../../Network'
import { isIphoneX } from '../../../../node_modules/react-native-iphone-x-helper'
// import sendStore from '../../../stores/SendTransactionStore'
// const BN = require('bn.js')

const { height } = Dimensions.get('window')
const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 20
// const isSmallScreen = height < 569
const isSmallScreen = height < 650
const isIPX = height === 812
// const diffGas = 0.000048

const dataNumber1 = [
  { number: '1' },
  { number: '2' },
  { number: '3' }
]
const dataNumber2 = [
  { number: '4' },
  { number: '5' },
  { number: '6' }
]
const dataNumber3 = [
  { number: '7' },
  { number: '8' },
  { number: '9' }
]
const dataNumber4 = [
  {
    number: '.'
  },
  { number: '0' },
  {
    icon: images.imgDeletePin,
    actions: 'delete'
  }
]

@observer
export default class SendTransactionScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    navigator: PropTypes.object
  }

  static defaultProps = {
    navigator: {}
  }
  constructor(props) {
    super(props)
    this.wallet = WalletStore.selectedWallet
  }

  componentWillMount() {
    NavigationStore.navigations.push(this.props.navigator)
    NavigationStore.navigation = this.props.navigator
  }

  componentDidMount() {
    sendTransactionStore.getGasPrice()
    if (NetworkStore.currentNetwork !== Network.MainNet) {
      NavigationStore.showToast(`You are on ${NetworkStore.getNetworkCapitalize()} Testnet`)
    }
  }

  _onKeyPress = debounce((text) => {
    HapticHandler.ImpactLight()
    this.input.add({ text })
  }, 0)

  _onBackPress = debounce(() => {
    this.input.remove()
  }, 0)

  _onLongPress = debounce(() => {
    this.input.clearAll()
  }, 0)

  formatArrayToNumberFloat(data, subData, type) {
    const array = [...data, ...subData]
    let string = ''
    array.forEach((element) => {
      string += element.text
    })
    const value = Number.isNaN(parseFloat(string.replace(/,/g, ''))) ? 0 : parseFloat(string.replace(/,/g, ''))
    return type ? +value.toFixed(2) : +value.toFixed(4)
  }

  checkAmount(inputStr, balanceStr) {
    return Starypto.Units.parseUnits(inputStr, 18)._bn.lte(Starypto.Units.parseUnits(balanceStr, 18)._bn)
  }

  renderSelectedCoinModal = () => {
    return (
      <Modal
        style={{
          height: isIPX ? height - 150 : height - 80,
          zIndex: 100,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: 'hidden',
          backgroundColor: AppStyle.backgroundColor
        }}
        swipeToClose
        onClosed={() => {
          sendTransactionStore.selectedModal && sendTransactionStore.selectedModal.close()
        }}
        position="bottom"
        ref={(ref) => { sendTransactionStore.selectedModal = ref }}
      >
        <View style={{ flex: 1, zIndex: 120, backgroundColor: AppStyle.backgroundColor }}>
          <View
            style={{
              alignSelf: 'center',
              height: 3,
              width: 45,
              borderRadius: 1.5,
              backgroundColor: AppStyle.secondaryTextColor,
              position: 'absolute',
              zIndex: 130,
              top: 10
            }}
          />
          <SelectedCoinScreen />
        </View>
      </Modal>
    )
  }

  renderHeader = () => {
    const { balanceCrypto, balanceUSD, postfix } = sendTransactionStore.wallet
    const balance = Helper.formatETH(balanceCrypto)
    const balanceMoney = Helper.formatUSD(balanceUSD)
    return (
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.exit}
          onPress={() => {
            NavigationStore.dismissView()
            setTimeout(() => {
              sendTransactionStore.clearData()
            }, 250)
          }}
        >
          <Image style={styles.exitBtn} source={images.closeButton} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={() => {
            sendTransactionStore.selectedModal && sendTransactionStore.selectedModal.open()
          }}
        >
          <Text style={styles.walletName}>{`${this.wallet.cardName} : `}</Text>
          <Text style={styles.headerBalance}>{sendTransactionStore.numberArray.type ? `$ ${balanceMoney}` : `${balance} ${postfix}`}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderNumber(arrayNumber) {
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <KeyboardButton
            key={`${num.number}`}
            style={styles.numberField}
            content={num.number}
            contentStyle={styles.numberText}
            onPress={() => this._onKeyPress(num.number)}
          />
        )
      }
      return (
        <TouchableOpacity
          key={num.actions}
          onLongPress={() => {
            this._onLongPress()
          }}
          onPress={() => {
            HapticHandler.ImpactLight()
            if (num.actions === 'delete') {
              this._onBackPress()
            } else {
              //
            }
          }}
        >
          <Animated.View style={styles.numberField} >
            <Image
              source={num.icon}
            />
          </Animated.View >
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.arrayNumber}>
        {nums}
      </View>
    )
  }

  renderInput = (prefix, postfix, cryptoBalance, moneyBalance) => {
    return (
      <View>
        <AnimationInput
          cryptoBalance={cryptoBalance}
          moneyBalance={moneyBalance}
          postfix={postfix}
          prefix={prefix}
          ref={ref => (this.input = ref)}
        />
      </View>
    )
  }

  renderKeyboard = () => {
    const {
      type
    } = sendTransactionStore.numberArray
    return (
      <View
        style={styles.keyboard}
      >
        <TouchableOpacity
          onPress={() => {
            HapticHandler.ImpactLight()
            if (type) {
              Helper.formatDecimalWithFourDigits(Helper.formatUSD(sendTransactionStore.wallet.balanceUSD), true)
            } else {
              Helper.formatDecimalWithFourDigits(Helper.formatETH(sendTransactionStore.wallet.balanceCrypto), false)
            }
          }}
          style={{
            height: 40,
            paddingLeft: 32,
            paddingRight: 32,
            alignSelf: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: '#0E1428',
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 16, color: '#4A90E2', fontFamily: 'OpenSans-Semibold' }}>Max</Text>
        </TouchableOpacity>
        {this.renderNumber(dataNumber1)}
        {this.renderNumber(dataNumber2)}
        {this.renderNumber(dataNumber3)}
        {this.renderNumber(dataNumber4)}
      </View>
    )
  }

  renderSendBtn() {
    const {
      data,
      subData,
      type
    } = sendTransactionStore.numberArray
    const amountStr = data.slice().map(s => s.text).join('')

    const balanceCrypto = sendTransactionStore.wallet.balanceCrypto || 0
    const balanceUSD = sendTransactionStore.wallet.balanceUSD || 0
    const amountIsValidUSD = (this.checkAmount(amountStr || '0', `${balanceUSD}`))
    const amountIsValid = (this.checkAmount(amountStr || '0', `${balanceCrypto}`))

    return (
      <TouchableOpacity
        style={styles.sendTo}
        disabled={(this.formatArrayToNumberFloat(data, subData, type) == 0 && data.length + subData.length == 0) || (type ? !amountIsValidUSD : !amountIsValid)}
        onPress={() => {
          NavigationStore.navigateTo(ScreenID.AddressInputScreen)
          sendTransactionStore.setValue(`${sendTransactionStore.cryptoValue}`)
        }}
      >
        <Text style={[styles.sendText, {
          color: (this.formatArrayToNumberFloat(data, subData, type) == 0 && data.length + subData.length == 0) || (type ? !amountIsValidUSD : !amountIsValid) ? AppStyle.greyTextInput : AppStyle.mainColor
        }]}
        >
          {constant.SEND_TO}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <View style={styles.viewContainer}>
          {this.renderHeader()}
          {this.renderInput('$', sendTransactionStore.wallet.postfix, sendTransactionStore.wallet.balanceCrypto, sendTransactionStore.wallet.balanceUSD)}
          <View>
            {this.renderKeyboard()}
            {this.renderSendBtn()}
          </View>
        </View>
        {this.renderSelectedCoinModal()}
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
    paddingBottom: isIphoneX ? 30 : 0,
    justifyContent: 'space-between'
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
    fontFamily: AppStyle.mainFontSemiBold,
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
  numberField: {
    width: isSmallScreen ? 65 : 75,
    height: isSmallScreen ? 65 : 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
  },
  numberText: {
    fontSize: 30,
    color: 'white'
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  keyboard: {
    marginLeft: 30,
    marginRight: 30
  },
  sendTo: {
    margin: 20,
    alignItems: AppStyle.Align.center,
    justifyContent: AppStyle.Align.center,
    height: 50,
    borderRadius: 5,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  sendText: {
    fontSize: 18,
    fontFamily: AppStyle.mainFontSemiBold
  }
})
