import { observable, action, computed } from 'mobx'
import { Linking, Platform, Alert, AsyncStorage } from 'react-native'
import * as StoreReview from 'react-native-store-review'
import constant from '../commons/constant'

const store = Platform.OS === 'ios' ? 'App Store' : 'Google Play'
const PLAY_STORE_LINK = 'market://details?id=app.starfish'

class ObservableSettingStore {
  @observable.ref navigator = null
  @observable.ref dataWallets = []
  @observable.ref isShowSmallBalance = true
  @observable.ref isSecuritySendTransaction = null
  @observable.ref isUnlockWithBiometry = false
  @observable.ref settingAbout = [
    {
      title: 'Join Telegram Group',
      onPress: () => {
        Linking.openURL('https://t.me/goldenwallet')
      }
    },
    {
      title: `Rate "Golden" in the ${store}`,
      onPress: () => {
        this.showPopupRating()
      }
    },
    {
      title: 'Privacy Policy',
      onPress: () => {
        this.navigator && this.navigator.navigate('PrivacyPolicyWebView')
      }
    }
    // {
    //   title: 'DApp Browser',
    //   onPress: () => {
    //     this.navigator && this.navigator.navigate('DWebBrowserScreen')
    //   }
    // }
  ]

  @observable settingSecurity = [
    // {
    //   saveID: 'SECURITY_PINCODE_UNLOCK',
    //   title: 'Touch ID',
    //   value: false
    // },
    {
      saveID: 'SECURITY_FACEID_SEND_TRANSACTION',
      title: 'Require PIN to send',
      value: false
    }
  ]

  @computed get listDataSetting() {
    return this.dataSetting.slice()
  }

  @computed get listSettingSecurity() {
    return this.settingSecurity.slice()
  }

  @action setDataWallet(wallets) {
    this.dataWallets = wallets
  }

  @action saveSercurity(index, value) {
    const tempData = this.settingSecurity
    tempData[index].value = value
    this.settingSecurity = [...tempData]
    const id = tempData[index].saveID
    AsyncStorage.setItem(id, JSON.stringify(value))
    if (index === 0) {
      this.isSecuritySendTransaction = value
    }
  }

  @action async setupSecurityValue() {
    const tempData = this.settingSecurity
    try {
      const value1 = await AsyncStorage.getItem(tempData[0].saveID)
      const securitySendTransaction = JSON.parse(value1)
      this.isSecuritySendTransaction = securitySendTransaction
      tempData[0].value = securitySendTransaction
      this.settingSecurity = [...tempData]
    } catch (e) {
      console.log(e)
    }
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

const SettingStore = new ObservableSettingStore()
export default SettingStore
