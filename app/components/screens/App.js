import React, { Component } from 'react'
import {
  StatusBar,
  Platform,
  View,
  AppState,
  BackHandler,
  Keyboard
} from 'react-native'
import crashlytics from 'react-native-fabric-crashlytics'
import SplashScreen from 'react-native-splash-screen'
import PropTypes from 'prop-types'
import Router from '../../Router'
import SettingStore from '../../stores/SettingStore'
import walletStore from '../../stores/WalletStore'
import currencyStore from '../../stores/CurrencyStore'
import AppStyle from '../../commons/AppStyle'
import Authen from '../../secure/Authen'
import TickerStore from '../../stores/TickerStore'
import NotificationStore from '../../stores/NotificationStore'
import NotificationListenter from '../../NotificationListener'
import PushNotificationHelper from '../../commons/PushNotificationHelper'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'
import ConnectionChecker from '../../ConnecChecker/ConnectChecker'

console.ignoredYellowBox = ['Warning: isMounted']

export default class App extends Component {
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

    NavigationStore.setupInitNavigation(props.navigator)
    this.connnectionChecker = new ConnectionChecker()
    NotificationStore.setupNotification()
  }

  async componentWillMount() {
    await Authen.setup()
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (NavigationStore.currentScreen !== ScreenID.UnlockScreen) {
        NavigationStore.popView()
      }
      return true
    })

    NotificationListenter.setupInitNotification()
    AppState.addEventListener('change', this._handleAppStateChange)
    PushNotificationHelper.setBadgeNumber(0)
    PushNotificationHelper.removeAllDeliveredNotifications()
    crashlytics.init()
    try {
      await SettingStore.setupSecurityValue()
      SplashScreen.hide()

      await currencyStore.getCurrencyAPI()
      await walletStore.getIsBackup()
    } catch (e) {
      NavigationStore.showPopup(e.message)
      SplashScreen.hide()
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.backHandler.remove()
  }

  appState = 'active'

  _handleAppStateChange = (nextAppState) => {
    if (this.appState === 'active' && nextAppState === 'inactive') {
      NavigationStore.showBlindView()
    }
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      NavigationStore.isShowNotif = false
      Keyboard.dismiss()
    }
    if (nextAppState === 'active') {
      if (NavigationStore.currentScreen === ScreenID.UnlockScreen) {
        NavigationStore.unLockScreen.setState({
          pinTyped: 0,
          pinCode: ''
        })
      }
      PushNotificationHelper.removeAllDeliveredNotifications()
      NavigationStore.dismissPopup()
    }
    if (this.appState === 'background' && nextAppState === 'active') {
      if (NavigationStore.currentScreen !== ScreenID.UnlockScreen) {
        if (!NavigationStore.backgroundByPermission) {
          NavigationStore.showModal(ScreenID.UnlockScreen, {}, false)
          setTimeout(() => TickerStore.callApi(), 300)
        } else {
          NavigationStore.backgroundByPermission = false
        }
      }
    }
    this.appState = nextAppState
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor={AppStyle.backgroundColor}
          barStyle="light-content"
          translucent
        />
        <Router />
      </View>
    )
  }
}
