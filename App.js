/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StatusBar,
  Platform,
  View,
  AppState,
  Keyboard
} from 'react-native'
import crashlytics from 'react-native-fabric-crashlytics'
import SplashScreen from 'react-native-splash-screen'
import Router from './app/Router'
import currencyStore from './app/stores/CurrencyStore'
import NavStore from './app/stores/NavStore'
import BlindScreen from './app/components/screens/BlindScreen'
import Lock from './app/components/elements/Lock'
// import TickerStore from './app/stores/TickerStore'
import NotificationStore from './app/stores/NotificationStore'
import NotificationListenter from './app/NotificationListener'
import PushNotificationHelper from './app/commons/PushNotificationHelper'
import Spinner from './app/components/elements/Spinner'
import MainStore from './app/AppStores/MainStore'

console.ignoredYellowBox = ['Warning: isMounted']

NotificationListenter.registerKilledListener()

export default class App extends Component {
  constructor(props) {
    super(props)
    NotificationStore.setupNotification()
  }

  async componentWillMount() {
    await MainStore.startApp()
  }

  async componentDidMount() {
    NotificationListenter.setupInitNotification()
    AppState.addEventListener('change', this._handleAppStateChange)
    PushNotificationHelper.setBadgeNumber(0)
    if (Platform.OS === 'ios') {
      //
    } else {
      PushNotificationHelper.removeAllDeliveredNotifications()
    }
    crashlytics.init()
    try {
      SplashScreen.hide()
      await currencyStore.getCurrencyAPI()
    } catch (e) {
      NavStore.popupCustom.show(e.message)
      SplashScreen.hide()
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  appState = 'active'

  _handleAppStateChange = (nextAppState) => {
    if (this.appState === 'active' && nextAppState === 'inactive') {
      if (NavStore.currentRouteName !== 'UnlockScreen') {
        this.blind.showBlind()
      }
    }
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      Keyboard.dismiss()
    }
    if (nextAppState === 'active') {
      this.blind.hideBlind()
    }
    if (this.appState === 'background' && nextAppState === 'active') {
      NavStore.lockScreen()
      // setTimeout(() => TickerStore.callApi(), 300)
    }
    this.appState = nextAppState
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
        <Router />
        <BlindScreen
          ref={(ref) => { this.blind = ref }}
        />
        <Spinner
          visible={false}
          ref={ref => (NavStore.loading = ref)}
        />
        <Lock
          ref={(ref) => { NavStore.lock = ref }}
        />
      </View>
    )
  }
}
