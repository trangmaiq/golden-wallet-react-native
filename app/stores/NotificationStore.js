import { observable, action } from 'mobx'
import FCM, { FCMEvent } from 'react-native-fcm'
import { Platform } from 'react-native'
import PushNotificationHelper from '../commons/PushNotificationHelper'
import LocalStore from './LocalStore'
import Permission from '../Permission'
import NotificationAPI from '../api/NotificationAPI'

const TOKEN_DEVICES_NOTIF_SAVED = 'TOKEN_DEVICES_NOTIF_SAVED'
const NOTIFICATION_USE_SAVED = 'NOTIFICATION_USE_SAVED'

class NotificationStore {
  @observable token = null
  @observable enable = true
  isInitFromNotification = false
  transactionFromNotif = {}

  constructor() {
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      this.token = token
      NotificationAPI.updateNotificationAllWallet()
    })

    this.setupUseNotification()
  }

  setValue(isInitFromNotification, transactionFromNotif) {
    this.isInitFromNotification = isInitFromNotification
    this.transactionFromNotif = transactionFromNotif
  }

  @action setupUseNotification() {
    LocalStore.getItems(NOTIFICATION_USE_SAVED, (response) => {
      if (response === undefined || response === null) {
        this.enable = true
        LocalStore.saveItem(NOTIFICATION_USE_SAVED, this.enable)
      } else {
        this.enable = response
      }
    }, (e) => {
      console.log(e)
    })
  }

  @action changeStateUseNotification() {
    this.enable = !this.enable
    LocalStore.saveItem(NOTIFICATION_USE_SAVED, this.enable)
    if (this.enable) {
      NotificationAPI.updateNotificationAllWallet()
    } else {
      PushNotificationHelper.removeAllDeliveredNotifications()
      NotificationAPI.deleteAllNotification()
    }
  }

  @action getToken() {
    PushNotificationHelper.getToken().then((response) => {
      this.token = response
      if (response) {
        LocalStore.saveItem(TOKEN_DEVICES_NOTIF_SAVED, response)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  @action setToken() {
    LocalStore.getItems(TOKEN_DEVICES_NOTIF_SAVED, (token) => {
      if (!token) {
        this.getToken()
      } else {
        this.token = token
      }
    }, (error) => {
      this.getToken()
      console.log(error)
    })
  }

  setupNotification = () => {
    if (Platform.OS === 'ios') {
      PushNotificationHelper.checkPermission().then((response) => {
        if (response === Permission.Authorized) {
          this.setToken()
        } else if (response === Permission.Undetermined) {
          PushNotificationHelper.requestPermission().then((res) => {
            if (res === Permission.Authorized) {
              this.setToken()
            }
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    } else {
      this.setToken()
    }
  }
}

export default new NotificationStore()
