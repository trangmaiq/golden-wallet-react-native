import React, { Component } from 'react'
import {
  SafeAreaView,
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
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { NavigationActions } from 'react-navigation'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import Modal from '../../../../Libs/react-native-modalbox'
import constant from '../../../commons/constant'
import KeyboardButton from '../elements/KeyboardButton'
import AnimationInput from '../elements/AnimationInput'
import SelectedCoinScreen from './SelectedCoinScreen'
import HapticHandler from '../../../Handler/HapticHandler'
import MainStore from '../../../AppStores/MainStore'
import { BigNumber } from 'bignumber.js'

// const BN = require('bn.js')

const { height } = Dimensions.get('window')
const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 20
const isSmallScreen = height < 650
const isIPX = height === 812

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
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.amountStore = MainStore.sendTransaction.amountStore
  }

  _onKeyPress = debounce((text) => {
    HapticHandler.ImpactLight()
    this.amountStore.add({ text })
  }, 0)

  _onBackPress = debounce(() => {
    this.amountStore.remove()
  }, 0)

  _onLongPress = debounce(() => {
    this.amountStore.clearAll()
  }, 0)

  _onMaxPress = () => {
    this.amountStore.max()
  }

  _onSendPress = () => {
    this.props.navigation.navigate('AddressInputScreen')
    this.amountStore.send()
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
          this.amountStore.selectedCoinModal && this.amountStore.selectedCoinModal.close()
        }}
        position="bottom"
        ref={(ref) => { this.amountStore.setSelectedCoinModal(ref) }}
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
    return (
      <View
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.exit}
          onPress={() => {
            this.props.navigation.dispatch(NavigationActions.back())
          }}
        >
          <Image style={styles.exitBtn} source={images.closeButton} resizeMode="contain" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={() => {
            this.amountStore.selectedCoinModal && this.amountStore.selectedCoinModal.open()
          }}
        >
          <Text style={styles.walletName}>{this.amountStore.walletName}:</Text>
          <Text style={styles.headerBalance}>{this.amountStore.amountHeaderString}</Text>
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

  renderInput = (data, subData, postfix) => {
    return (
      <View>
        <AnimationInput
          ref={ref => (this.input = ref)}
          data={data}
          postfix={postfix}
          subData={subData}
        />
      </View>
    )
  }

  renderKeyboard = () => {
    return (
      <View
        style={styles.keyboard}
      >
        <TouchableOpacity
          style={styles.maxButton}
          onPress={this._onMaxPress}
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
    return (
      <TouchableOpacity
        style={styles.sendTo}
        disabled={!this.amountStore.checkInputValid}
        onPress={this._onSendPress}
      >
        <Text style={[styles.sendText, { color: this.amountStore.checkInputValid ? AppStyle.mainColor : AppStyle.greyTextInput }]}>
          {constant.SEND_TO}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      data,
      subData,
      isUSD,
      isHadPoint
    } = this.amountStore.getAmountText
    // console.log(new BigNumber('111111.12e+18').toString(10))
    return (
      <SafeAreaView
        style={styles.container}
      >
        <View style={styles.viewContainer}>
          {this.renderHeader()}
          {this.renderInput(this.amountStore.getAmountText, this.amountStore.amountSubTextString, this.amountStore.postfix)}
          <View>
            {this.renderKeyboard()}
            {this.renderSendBtn()}
          </View>
        </View>
        {this.renderSelectedCoinModal()}
      </SafeAreaView>
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
  numberField: {
    width: isSmallScreen ? 65 : 75,
    height: isSmallScreen ? 65 : 75,
    // borderRadius: 37.5,
    // backgroundColor: AppStyle.colorPinCode,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
  },
  numberText: {
    // fontFamily: 'OpenSans-Semibold',
    fontSize: 30,
    color: 'white'
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between'
    // marginTop: height * 0.01
  },
  keyboard: {
    marginLeft: 30,
    marginRight: 30
  },
  sendTo: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 5,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  sendText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  maxButton: {
    height: 40,
    paddingLeft: 32,
    paddingRight: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#0E1428',
    marginBottom: 10
  }
})
