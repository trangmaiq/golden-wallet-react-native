import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import SettingItem from './SettingItem'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class AppSetting extends Component {
  static propTypes = {
    onNetworkPress: PropTypes.func.isRequired,
    onNotificationSwitch: PropTypes.func.isRequired
  }

  static defaultProps = {

  }

  get currentNetWork() {
    return MainStore.appState.config.network
  }

  render() {
    const { onNetworkPress, onNotificationSwitch } = this.props
    const network = this.currentNetWork.replace(/^\w/, c => c.toUpperCase())
    return (
      <View style={styles.container}>
        <SettingItem
          style={{ borderTopWidth: 1 }}
          mainText="Network"
          onPress={onNetworkPress}
          subText={network}
        />
        <SettingItem
          mainText="Enable Notification"
          disable
          type="switch"
          enableSwitch={false}
          onSwitch={onNotificationSwitch}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  }
})
