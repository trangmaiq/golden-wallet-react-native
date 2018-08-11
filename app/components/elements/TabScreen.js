import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'

const list = [
  {
    title: 'Router',
    key: 'Router'
  },
  {
    title: 'Address Book Screen',
    key: 'AddressBookScreen'
  },
  {
    title: 'Add Contact Screen',
    key: 'AddContactScreen'
  },
  {
    title: 'Home Screen',
    key: 'HomeScreen'
  },
  {
    title: 'Create Wallet Screen',
    key: 'CreateWalletScreen'
  },
  {
    title: 'Transaction Detail Screen',
    key: 'TransactionDetailScreen'
  },
  {
    title: 'Transaction Detail Info Screen',
    key: 'TransactionDetailInfoScreen'
  },
  {
    title: 'Import Wallet Screen',
    key: 'ImportWalletScreen'
  },
  {
    title: 'Import Via Mnemonic Screen',
    key: 'ImportViaMnemonicScreen'
  },
  {
    title: 'Import Via Private Key Screen',
    key: 'ImportViaPrivateKeyScreen'
  },
  {
    title: 'Import Via Address Screen',
    key: 'ImportViaAddressScreen'
  },
  {
    title: 'Choose Address Screen',
    key: 'ChooseAddressScreen'
  },
  {
    title: 'Setting Screen',
    key: 'SettingScreen'
  },
  {
    title: 'Token Screen',
    key: 'TokenScreen'
  },
  {
    title: 'Send Transaction',
    key: 'SendTransactionScreen'
  },
  {
    title: 'BackUp Wallet Screen',
    key: 'BackUpWalletScreen'
  },
  {
    title: 'Backup ChooseSucces Screen',
    key: 'BackupChooseSuccesScreen'
  },
  {
    title: 'Edit Your Wallet Screen',
    key: 'EditYourWalletScreen'
  },
  {
    title: 'BackupChooseKeywordScreen',
    key: 'BackupChooseKeywordScreen'
  },
  {
    title: 'UnlockScreen',
    key: 'UnlockScreen'
  },
  {
    title: 'Scan QR Code Screen',
    key: 'ScanQRCodeScreen'
  },
  {
    title: 'Selected Coin Screen',
    key: 'SelectedCoinScreen'
  },
  {
    title: 'Backup Screen',
    key: 'BackupScreen'
  },
  {
    title: 'Contacts Element Screen',
    key: 'ContactsElementScreen'
  }
]
const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  rowItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class TabScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
  }
  render() {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <FlatList
          style={styles.list}
          data={list}
          keyExactor={item => `${item.key}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => this.props.navigation.navigate(item.key)}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}
