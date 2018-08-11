import FCM from 'react-native-fcm'
import Permissions from 'react-native-permissions'

class PushNotificationHelper {
  removeAllDeliveredNotifications = () => {
    FCM.removeAllDeliveredNotifications()
  }

  setBadgeNumber(number) {
    FCM.setBadgeNumber(number)
  }

  getToken() {
    return FCM.getFCMToken()
  }

  checkPermission() {
    return Permissions.check('notification')
  }

  requestPermission() {
    return FCM.requestPermissions({ badge: true, sound: true, alert: true })
  }
}

export default new PushNotificationHelper()
