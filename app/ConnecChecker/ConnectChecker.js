import { NetInfo } from 'react-native'
import NavigationStore from '../navigation/NavigationStore'

const Connection = {
  none: 'none',
  wifi: 'wifi',
  cellular: 'cellular',
  unknown: 'unknown'
}

export default class ConnectionChecker {
  constructor() {
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange

    NetInfo.getConnectionInfo().then((connectionInfo) => {
      if (connectionInfo.type !== Connection.none) {
        this.haveConnection = true
      } else {
        this.haveConnection = false
      }
    }).catch(e => () => { })

    NetInfo.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  handleFirstConnectivityChange(connectionInfo) {
    if (connectionInfo.type === Connection.none) {
      if (this.haveConnection) {
        NavigationStore.showToastAlert('This Internet connection appears to be offline')
      }
      this.haveConnection = false
    } else {
      this.haveConnection = true
    }
  }

  removeListener() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }
}
