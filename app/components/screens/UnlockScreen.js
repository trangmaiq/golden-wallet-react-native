import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import GoldenLoading from '../elements/GoldenLoading'
import TouchID from '../../../Libs/react-native-touch-id'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import SettingStore from '../../stores/SettingStore'
import HapticHandler from '../../Handler/HapticHandler'
import BiometryCounter from '../../Handler/BiometryCounter'
import Authen from '../../secure/Authen'
import NavigationStore from '../../navigation/NavigationStore'
import PushNotificationHelper from '../../commons/PushNotificationHelper'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
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

@observer
export default class UnlockScreenA extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    onUnlock: PropTypes.func,
    onUnlockToEdit: PropTypes.func,
    isEdit: PropTypes.bool,
    navigator: PropTypes.object
  }

  static defaultProps = {
    onUnlock: () => { },
    onUnlockToEdit: () => { },
    isEdit: false,
    navigator: {}
  }

  state = {
    pinTyped: 0,
    animatedValue: new Animated.Value(0),
    isShake: false,
    pinCode: '',
    unlockDes: null,
    pinConfirm: '',
    loading: false
  }

  componentWillMount() {
    const {
      navigator
    } = this.props
    NavigationStore.navigations.push(navigator)
    NavigationStore.navigation = navigator
  }

  componentDidMount() {
    NavigationStore.unLockScreen = this
    // setTimeout(() => StatusBar.setHidden(true), 2000)
    // setTimeout(() => StatusBar.setHidden(false), 5000)
  }

  _handlePressPin = (num) => {
    HapticHandler.ImpactLight()
    const { pinCode, pinTyped, pinConfirm } = this.state
    if (pinTyped === 5) {
      this.setState({
        pinTyped: pinTyped + 1,
        pinCode: pinCode + num.number
      }, async () => {
        await Authen.initIVIfNeeded()
        if (Authen.isCreated) {
          this.setState({
            loading: true
          }, () => {
            setTimeout(() => this._handleGetData(this.state.pinCode)
              .catch(e => this._handleErrorPin(e)), 0)
          })
        } else if (pinConfirm === '') {
          this._handleCreatePin(this.state.pinCode)
        } else if (this.state.pinCode === this.state.pinConfirm) {
          this._handleConfirmPin(this.state.pinCode)
        } else {
          this._handleErrorPin()
        }
      })
    } else {
      this.setState({
        pinTyped: pinTyped + 1,
        pinCode: pinCode + num.number
      })
    }
  }

  _handleCreatePin(pinCode) {
    setTimeout(() => {
      this.setState({
        pinTyped: 0,
        pinConfirm: pinCode,
        unlockDes: 'Confirm your PIN',
        pinCode: ''
      })
    }, 100)
  }

  async _handleConfirmPin(pinCode) {
    const { onUnlock } = this.props
    Authen.savePin()
    HapticHandler.NotificationSuccess()
    if (SettingStore.isSecuritySendTransaction === null) {
      SettingStore.saveSercurity(0, true)
    }
    await Authen.decrypData(pinCode, Authen.iv)
      .then((_) => {
        setTimeout(() => {
          Authen.isCreated = true
          NavigationStore.dismissView()
          NavigationStore.dismissPopup()
        }, 100)
        onUnlock()
        NavigationStore.isShowNotif = true
      })
      .catch(e => this._handleErrorPin(e))
  }

  async _handleGetData(pinHash) {
    const {
      onUnlockToEdit,
      isEdit,
      onUnlock,
      runUnlock = false
    } = this.props
    await Authen.decrypData(pinHash, Authen.iv)
      .then((res) => {
        HapticHandler.NotificationSuccess()
        if (runUnlock) {
          onUnlock()
        }
        if (isEdit) {
          onUnlockToEdit()
        }
        NavigationStore.isShowNotif = true
        setTimeout(() => {
          NavigationStore.dismissView()
          NavigationStore.dismissPopup()
        }, 100)
      })
      .catch(e => this._handleErrorPin(e))
    // }
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
          pinTyped: 6,
          loading: true
        }, () => this._handleGetData())
      })
      .catch((e) => {
        BiometryCounter.numberOfFailed += 1
      })
  }

  _handleErrorPin(e) {
    const { animatedValue, isShake } = this.state
    HapticHandler.NotificationError()
    this.setState({
      loading: false
    }, () => {
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
          isShake: !isShake,
          loading: false
        })
      }, 250)
    })
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
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <TouchableOpacity
            onPress={() => {
              this._handlePressPin(num)
            }}
            key={num.number}
          >
            <View style={styles.numberField}>
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
            }
          }}
        >
          <View style={styles.numberField}>
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
    const { unlockDes, animatedValue, loading } = this.state
    this.unlockDes = Authen.isCreated ? 'Unlock your Golden' : 'Create your PIN'
    const unlockDescription = unlockDes !== null ? unlockDes : this.unlockDes
    const animationShake = animatedValue.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, -20, 20, 0],
      useNativeDriver: true
    })
    if (loading) {
      this.loading.startAnimation()
    } else {
      this.loading && this.loading.stop()
    }
    return (
      <View style={styles.container}>
        <StatusBar
          hidden
        />
        <GoldenLoading
          ref={(ref) => { this.loading = ref }}
          style={{ marginTop: isSmallScreen ? 10 : height * 0.07 }}
          isSpin={false}
        />
        <Text style={styles.desText}>{unlockDescription}</Text>
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width
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
  },
  numberText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 36,
    color: 'white'
  },
  cancelText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 20,
    color: 'white'
  }
})
