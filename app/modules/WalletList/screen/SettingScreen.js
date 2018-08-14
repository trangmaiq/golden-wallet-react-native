import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import AppStyle from '../../../commons/AppStyle'
import SettingItem from '../elements/SettingItem'

@observer
export default class SettingScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  componentDidMount() {

  }

  onManageWalletPress = () => {

  }

  onAddressBookPress = () => {

  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <SettingItem
            style={{ marginTop: 15 }}
            mainText="Manage Wallets"
            onPress={this.onManageWalletPress}
          />
          <SettingItem
            style={{ borderBottomWidth: 1 }}
            mainText="Address Book"
            onPress={this.onAddressBookPress}
          />
          <Text style={styles.titleText}>Community</Text>
          <SettingItem
            iconRight={false}
            mainText="Telegram Group"
            onPress={this.onAddressBookPress}
          />
        </View>
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  titleText: {
    color: AppStyle.mainTextColor,
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    margin: 20
  }
})
