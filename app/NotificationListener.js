import FCM, {
  FCMEvent
  // RemoteNotificationResult,
  // WillPresentNotificationResult,
  // NotificationType
} from 'react-native-fcm'
import NotificationStore from './stores/NotificationStore'
import NavigationStore from './navigation/NavigationStore'
import ScreenID from './navigation/ScreenID'

const NotificationListenter = {
  setupInitNotification: () => {
    FCM.getInitialNotification().then((notif) => {
      const {
        address,
        contract,
        wallet,
        tx
      } = notif

      if (!address) {
        NotificationStore.isInitFromNotification = false
        NotificationStore.transactionFromNotif = {}
      } else {
        NotificationStore.transactionFromNotif = {
          address,
          name: wallet,
          addressToken: contract,
          tx
        }
        NotificationStore.isInitFromNotification = true
      }
    }).catch(e => () => { })
  },

  registerKilledListener: () => {

  },

  registerAppListener: () => {
    FCM.on(FCMEvent.Notification, (notif) => {
      const {
        address,
        contract,
        wallet,
        tx
      } = notif
      if (!address) {
        return
      }

      if (notif && notif.opened_from_tray) {
        setTimeout(() => {
          if (!NotificationStore.isInitFromNotification) {
            NavigationStore.navigateTo(ScreenID.TransactionDetailScreen, {
              address,
              name: wallet,
              addressToken: contract,
              tx
            })
          } else {
            NotificationStore.isInitFromNotification = false
            NotificationStore.transactionFromNotif = null
          }
        }, 500)
      }

      if (NavigationStore.isShowNotif) {
        // if (NavigationStore.currentScreen !== ScreenID.UnlockScreen) {
        // if (!NotificationStore.isInitFromNotification) {
        NavigationStore.showNotification(notif)
        // }
        // }
      }
    })
  }
}

export default NotificationListenter
