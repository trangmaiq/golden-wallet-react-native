import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import sendStore from '../stores/SendTransactionStore'
import AppStyle from '../../../commons/AppStyle'
import AddressItem from '../elements/AddressItem'
import ContactStore from '../../../stores/ContactStore'

// const { width, height } = Dimensions.get('window')

export default class ChooseAdressScreen extends PureComponent {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    onSelectedAddress: PropTypes.func
  }

  static defaultProps = {
    onSelectedAddress: () => { }
  }

  _keyExtractor = (item, index) => {
    return item.address
  }
  render() {
    const { onSelectedAddress } = this.props
    const dataAddressBook = ContactStore.contacts.slice()
    return (
      <View
        style={styles.container}
      >
        <NavigationHeader
          headerItem={{
            title: 'Address Book',
            icon: null,
            button: images.closeButton
          }}
          action={() => {
            sendStore.addressModal && sendStore.addressModal.close()
          }}
        />
        <FlatList
          style={[styles.list]}
          data={dataAddressBook}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => (
            <AddressItem
              onPress={() => {
                onSelectedAddress(item.address)
                sendStore.addressModal.close()
              }}
              name={item.name}
              address={item.address}
            />
          )}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
    paddingTop: 40
  },
  list: {
    marginTop: 30
  }
})
