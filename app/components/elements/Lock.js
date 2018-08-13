import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Animated,
  TouchableOpacity,
  StatusBar
} from 'react-native'

import TouchID from '../../../Libs/react-native-touch-id'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
/* eslint-disable-next-line */
import GoldenLoading from './../elements/GoldenLoading'
import BiometryCounter from '../../Handler/BiometryCounter'
import LayoutUtils from '../../commons/LayoutUtils'
import HapticHandler from '../../Handler/HapticHandler'
import SecureDS from '../../AppStores/DataSource/SecureDS'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const extraBottom = LayoutUtils.getExtraBottom()
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
    actions: 'cancel'
  },
  { number: '0' },
  {
    icon: images.imgDeletePin,
    actions: 'delete'
  }
]

export default class Lock extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  state = {
    pinTyped: 0,
    animatedValue: new Animated.Value(0),
    isShake: false,
    pinCode: '',
    offsetY: new Animated.Value(0 - height - extraBottom),
    shouldShowCancel: false,
    params: {
      shouldLoadData: true
    }
  }

  _handlePressPin(num) {
    HapticHandler.ImpactLight()
    const { pinTyped, pinCode } = this.state
    if (pinTyped === 5) {
      this.setState({
        pinTyped: pinTyped + 1,
        pinCode: pinCode + num.number
      }, async () => {
        const secureDS = await SecureDS.getInstance(this.state.pinCode)
        if (!secureDS) {
          this._handleErrorPin()
        } else {
          this._handlePass()
        }
      })
    } else {
      this.setState({
        pinTyped: pinTyped + 1,
        pinCode: pinCode + num.number
      })
    }
  }

  _handleOpenWithID() {
    const optionalConfigObject = {
      title: 'Authentication',
      color: AppStyle.backgroundColor,
      fallbackLabel: 'Enter Pincode'
    }

    TouchID.authenticate('Unlock with your touch ID', optionalConfigObject)
      .then(() => {
        BiometryCounter.numberOfFailed = 0
        this.setState({
          pinTyped: 6
        }, () => this._handlePass())
      })
      .catch((e) => {
        BiometryCounter.numberOfFailed += 1
      })
  }

  _handlePass() {
    this._hide()
    HapticHandler.NotificationSuccess()
    setTimeout(() => this.state.params.onUnlock && this.state.params.onUnlock(), 250)
  }

  _handleErrorPin(e) {
    const { animatedValue, isShake } = this.state
    Animated.spring(
      animatedValue,
      {
        toValue: isShake ? 0 : 1,
        duration: 250,
        tension: 80,
        friction: 4
      }
    ).start()
    setTimeout(() => {
      this.setState({
        pinTyped: 0,
        pinCode: '',
        isShake: !isShake
      })
    }, 250)
  }

  _animatedOffset(value, onFinish = () => { }) {
    Animated.timing(this.state.offsetY, {
      toValue: value,
      duration: 250
    }).start(() => {
      onFinish()
    })
  }

  _show(params, showBiometry, shouldShowCancel = false) {
    StatusBar.setHidden(true, true)
    this.setState({
      params: { ...params },
      shouldShowCancel,
      pinCode: '',
      pinTyped: 0
    })
    this._animatedOffset(0)
  }

  _hide() {
    StatusBar.setHidden(false, true)
    this.setState({
      pinTyped: 0,
      pinCode: ''
    })
    this._animatedOffset(0 - height - extraBottom)
  }

  handleDeletePin() {
    const { pinTyped, pinCode } = this.state
    if (pinTyped > 0) {
      this.setState({
        pinTyped: pinTyped - 1,
        pinCode: pinCode.slice(0, -1)
      })
    }
  }

  renderDots(numberOfDots) {
    const dots = []
    const { pinTyped } = this.state
    const styleDot = {
      width: 13,
      height: 13,
      borderRadius: 6.5,
      borderWidth: 1,
      borderColor: 'white',
      marginHorizontal: 12
    }
    for (let i = 0; i < numberOfDots; i++) {
      const backgroundColor = i < pinTyped ? { backgroundColor: 'white' } : {}
      const dot = <View style={[styleDot, backgroundColor]} key={i} />
      dots.push(dot)
    }
    return dots
  }

  renderNumber(arrayNumber) {
    const { shouldShowCancel } = this.state
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <TouchableOpacity
            onPress={() => {
              this._handlePressPin(num)
            }}
            key={num.number}
          >
            <View style={[styles.numberField]}>
              <Text style={styles.numberText}>{num.number}</Text>
            </View>
          </TouchableOpacity>
        )
      }
      return (
        <TouchableOpacity
          key={num.actions}
          onPress={() => {
            if (num.actions === 'delete') {
              this.handleDeletePin()
            } else if (shouldShowCancel) {
              this._hide()
            }
          }}
        >
          <View style={[styles.numberField]} >
            {num.actions !== 'cancel' &&
              <Image
                source={num.icon}
              />
            }
            {num.actions === 'cancel' &&
              <Text style={styles.cancelText}>Cancel</Text>
            }
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.arrayNumber}>
        {nums}
      </View>
    )
  }

  render() {
    const animationShake = this.state.animatedValue.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, -20, 20, 0],
      useNativeDriver: true
    })

    return (
      <Animated.View
        style={[styles.container, {
          bottom: this.state.offsetY
        }]}
      >
        <GoldenLoading
          ref={(ref) => { this.loading = ref }}
          style={{ marginTop: isSmallScreen ? 10 : height * 0.07 }}
          isSpin={false}
        />
        <Text style={styles.desText}>Unlock with your PIN</Text>
        <Animated.View
          style={[styles.pinField, {
            transform: [
              {
                translateX: animationShake
              }
            ]
          }]}
        >
          {this.renderDots(6)}
        </Animated.View>
        <View style={{ marginTop: isSmallScreen ? 10 : height * 0.03 }}>
          {this.renderNumber(dataNumber1)}
          {this.renderNumber(dataNumber2)}
          {this.renderNumber(dataNumber3)}
          {this.renderNumber(dataNumber4)}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width,
    height: height + extraBottom,
    backgroundColor: AppStyle.backgroundColor,
    position: 'absolute'
  },
  desText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : 22,
    fontFamily: 'OpenSans-Bold',
    marginTop: isSmallScreen ? 10 : height * 0.03
  },
  pinField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isSmallScreen ? 13 : height * 0.05
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02
  },
  numberField: {
    width: isSmallScreen ? 60 : 75,
    height: isSmallScreen ? 60 : 75,
    borderRadius: 37.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
    // backgroundColor: AppStyle.colorPinCode
  },
  numberText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 36,
    color: 'white'
  },
  cancelText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: 'white'
  }
})
