import DeviceInfo from 'react-native-device-info'
import ApiCaller from './api-caller'
import NotificationStore from '../stores/NotificationStore'
import WalletStore from '../stores/WalletStore'
import LocalStore from '../stores/LocalStore'

class NotificationAPI {
  postDeviceTokenWithWallet({ name, address }) {
    const params = this._getParams(name, address)
    ApiCaller.post('http://wallet.skylab.vn/wallets', params, true, { 'Content-Type': 'application/json' }, '').then((response) => {
      const { data, success } = response.data
      if (success) {
        LocalStore.saveItem(address, data.id)
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  deleteNotificationWithWallet(address) {
    LocalStore.getItems(address, (id) => {
      ApiCaller.delete(`http://wallet.skylab.vn/wallets/${id}`, {}, false, { 'Content-Type': 'application/x-www-form-urlencoded' }).then((response) => {
        // console.log(response)
      }).catch((e) => {
        console.log(e)
      })
    })
  }

  deleteAllNotification() {
    if (!WalletStore.dataCards || WalletStore.dataCards.length === 0) {
      return
    }
    WalletStore.dataCards.forEach((wallet) => {
      LocalStore.getItems(wallet.address, (id) => {
        ApiCaller.delete(`http://wallet.skylab.vn/wallets/${id}`, {}, false, { 'Content-Type': 'application/x-www-form-urlencoded' }).then((response) => {
        }).catch((e) => {
          console.log(e)
        })
      })
    })
  }

  updateNotificationAllWallet() {
    if (!WalletStore.userWallets) {
      return
    }
    if (!NotificationStore.enable) {
      return
    }
    const params = this._getParamstWalletUpdate()
    ApiCaller.post('http://wallet.skylab.vn/wallets/list', params, true, { 'Content-Type': 'application/json' }, '').then((response) => {
      response.data.data.forEach((wallet) => {
        LocalStore.saveItem(wallet.address, wallet.id)
      })
    }).catch((e) => {
      console.log(e)
    })
  }

  _getParamstWalletUpdate() {
    const deviceID = DeviceInfo.getUniqueID()
    const wallets = WalletStore.userWallets.ethWallets.map((wallet) => {
      return { name: wallet.cardName, address: wallet.address }
    })
    return {
      device_token: NotificationStore.token,
      device_udid: deviceID,
      wallets
    }
  }

  _getParams(name, address) {
    const deviceID = DeviceInfo.getUniqueID()
    return {
      name,
      address,
      device_udid: deviceID,
      device_token: NotificationStore.token
    }
  }
}

export default new NotificationAPI()
