import {
  Platform
  // AsyncStorage,
  // AppState
} from 'react-native'
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
  // NotificationActionType,
  // NotificationActionOption,
  // NotificationCategoryOption
} from 'react-native-fcm'
import NotificationStore from './stores/NotificationStore'

const NotificationListenter = {
  setupInitNotification: () => {
    FCM.getInitialNotification().then((notif) => {
      const {
        address,
        token,
        wallet
      } = notif
      if (!address) {
        NotificationStore.isInitFromNotification = false
        NotificationStore.transactionFromNotif = {}
      } else {
        NotificationStore.transactionFromNotif = {
          address,
          name: wallet,
          addressToken: token
        }
        NotificationStore.isInitFromNotification = true
      }
    })
  },
  registerKilledListener: () => {
    // FCM.on(FCMEvent.Notification, (notif) => {
    //   FCM.getBadgeNumber().then((badge) => {
    //     FCM.setBadgeNumber(badge + 1)
    //   }).catch(e => console.log(e))
    // })
  },
  registerAppListener: (navigation) => {
    FCM.on(FCMEvent.Notification, (notif) => {
      const {
        address,
        token,
        wallet
      } = notif
      if (Platform.OS === 'ios' && notif._notificationType === NotificationType.WillPresent && !notif.local_notification) {
        notif.finish(WillPresentNotificationResult.All)
        return
      }

      if (notif && notif.opened_from_tray) {
        setTimeout(() => {
          if (!NotificationStore.isInitFromNotification) {
            navigation.push('TransactionDetailScreen', {
              address,
              name: wallet,
              addressToken: token
            })
          } else {
            NotificationStore.isInitFromNotification = false
            NotificationStore.transactionFromNotif = null
          }
        }, 500)
      }

      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData)
            break
          case NotificationType.NotificationResponse:
            notif.finish()
            break
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All)
            break
          default:
        }
      }
    })
  }
}

export default NotificationListenter
