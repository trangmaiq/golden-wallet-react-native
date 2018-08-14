import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  FlatList
} from 'react-native'
import { observer } from 'mobx-react/native'
import AppStyle from '../../../commons/AppStyle'
import SettingItem from '../elements/SettingItem'
import SettingStore from '../SettingStore'
import NavStore from '../../../stores/NavStore'
import MainStore from '../../../AppStores/MainStore'
import AppSetting from '../../Setting/elements/AppSetting'

@observer
export default class SettingScreen extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props)
    this.settingStore = new SettingStore()
  }

  componentDidMount() {

  }

  onManageWalletPress = () => {
    NavStore.pushToScreen('ManageWalletScreen')
  }

  onAddressBookPress = () => {
    MainStore.gotoAddressBook()
    NavStore.pushToScreen('AddressBookScreen')
  }

  onNetworkPress = () => NavStore.pushToScreen('NetworkScreen')

  onNotificationSwitch = () => { }

  renderCommunity = () => (
    <FlatList
      style={{ flex: 1 }}
      ListHeaderComponent={<Text style={styles.titleText}>Community</Text>}
      data={this.settingStore.dataCommunity}
      keyExtractor={v => v.mainText}
      scrollEnabled={false}
      renderItem={({ item, index }) =>
        (
          <SettingItem
            style={{ borderTopWidth: index === 0 ? 0 : 1 }}
            mainText={item.mainText}
            onPress={item.onPress}
            iconRight={item.iconRight}
          />
        )
      }
    />
  )

  renderSecurity = () => (
    <FlatList
      style={{ flex: 1 }}
      ListHeaderComponent={<Text style={styles.titleText}>Security</Text>}
      data={this.settingStore.dataSecurity}
      keyExtractor={v => v.mainText}
      scrollEnabled={false}
      renderItem={({ item, index }) =>
        (
          <SettingItem
            style={{ borderTopWidth: index === 0 ? 0 : 1 }}
            mainText={item.mainText}
            onPress={item.onPress}
            iconRight={item.iconRight}
          />
        )
      }
    />
  )

  renderAppSetting = () => (
    <View>
      <Text style={styles.titleText}>App Setting</Text>
      <AppSetting
        onNetworkPress={this.onNetworkPress}
        onNotificationSwitch={this.onNotificationSwitch}
      />
    </View>
  )

  renderAbount = () => (
    <FlatList
      style={{ flex: 1 }}
      ListHeaderComponent={<Text style={styles.titleText}>About</Text>}
      data={this.settingStore.dataAbout}
      keyExtractor={v => v.mainText}
      scrollEnabled={false}
      renderItem={({ item, index }) =>
        (
          <SettingItem
            style={{ borderTopWidth: index === 0 ? 0 : 1 }}
            mainText={item.mainText}
            subText={item.subText}
            onPress={item.onPress}
            iconRight={item.iconRight}
          />
        )
      }
    />
  )

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <SettingItem
            style={{ marginTop: 15, borderTopWidth: 0 }}
            mainText="Manage Wallets"
            onPress={this.onManageWalletPress}
          />
          <SettingItem
            mainText="Address Book"
            onPress={this.onAddressBookPress}
          />
          {this.renderCommunity()}
          {this.renderSecurity()}
          {this.renderAppSetting()}
          {this.renderAbount()}
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
