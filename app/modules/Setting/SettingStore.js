import { observable, action } from 'mobx'
import { Platform, Linking, Alert } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import * as StoreReview from 'react-native-store-review'
import constant from '../../commons/constant'
import NavStore from '../../stores/NavStore'

const store = Platform.OS === 'ios' ? 'App Store' : 'Google Play'
const PLAY_STORE_LINK = 'market://details?id=app.starfish'

export default class SettingStore {
  @observable dataCommunity = [
    {
      mainText: 'Telegram Group',
      onPress: () => { Linking.openURL('https://t.me/goldenwallet') },
      iconRight: false
    },
    {
      mainText: 'Follow Twitter',
      onPress: () => { },
      iconRight: false
    },
    {
      mainText: 'Medium',
      onPress: () => { },
      iconRight: false
    },
    {
      mainText: 'Request Feature',
      onPress: () => { },
      iconRight: false
    }
  ]

  @observable dataSecurity = [
    {
      mainText: 'Payment Protection',
      onPress: () => { }
    },
    {
      mainText: 'Change Pincode',
      onPress: () => { }
    }
  ]

  @observable dataAppSetting = [
    {
      mainText: 'Network',
      onPress: () => { },
      subText: 'Mainnet'
    },
    {
      mainText: 'Enable Notification',
      onPress: () => { },
      type: 'switch',
      enableSwitch: false
    }
  ]

  @observable dataAbout = [
    {
      mainText: `Rate Golden on ${store}`,
      onPress: () => { this.showPopupRating() }
    },
    {
      mainText: 'Source Code',
      onPress: () => { },
      subText: 'Github'
    },
    {
      mainText: 'Privacy & Terms',
      onPress: () => { NavStore.pushToScreen('PrivacyPolicyWebView') }
    },
    {
      mainText: 'App Version',
      onPress: () => { },
      subText: DeviceInfo.getVersion()
    }
  ]

  @action onSwitchEnableNotification() {
    const { enableSwitch } = this.dataAppSetting[1]
    this.dataAppSetting = [
      {
        mainText: 'Network',
        onPress: () => { },
        subText: 'Mainnet'
      },
      {
        mainText: 'Enable Notification',
        onPress: () => { },
        type: 'switch',
        enableSwitch: !enableSwitch
      }
    ]
  }

  showPopupRating() {
    if (Platform.OS === 'ios') {
      // This API is only available on iOS 10.3 or later
      if (StoreReview.isAvailable) {
        StoreReview.requestReview()
      }
    } else {
      Alert.alert(
        constant.titleRatingApp,
        constant.desRatingApp,
        [
          { text: constant.ratingLater },
          { text: constant.cancel, onPress: () => { }, style: 'cancel' },
          {
            text: constant.rating,
            onPress: () => {
              Linking.openURL(PLAY_STORE_LINK)
                .catch(err => console.error('An error occurred', err))
            }
          }
        ],
        { cancelable: false }
      )
    }
  }
}
