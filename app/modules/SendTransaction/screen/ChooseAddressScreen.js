import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import AddressItem from '../elements/AddressItem'
import ContactStore from '../../../stores/ContactStore'
import MainStore from '../../../AppStores/MainStore'

// const { width, height } = Dimensions.get('window')

export default class ChooseAdressScreen extends PureComponent {
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
    const dataAddressBook = MainStore.appState.addressBooks.slice()
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
            const { addressModal } = MainStore.sendTransaction.addressInputStore
            addressModal && addressModal.close()
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
                const { addressModal } = MainStore.sendTransaction.addressInputStore
                addressModal && addressModal.close()
              }}
              name={item.title}
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
