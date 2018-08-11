import React, { Component } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import SwipeableItem from '../elements/SwipeableItem'
import ContactStore from '../../stores/ContactStore'
import WalletStore from '../../stores/WalletStore'
import sendStore from '../../stores/SendTransactionStore'
import LayoutUtils from '../../commons/LayoutUtils'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()
@observer
export default class AddressBookScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  _renderNoAddressView() {
    return (
      <View style={{ alignItems: 'center', flex: 1, marginBottom: 30 }}>
        <Image
          source={images.noContactImage}
          style={styles.contactImageStyle}
        />
        <Text style={{
          fontSize: 26,
          fontFamily: AppStyle.mainFontBold,
          marginTop: 60,
          color: AppStyle.titleDarkModeColor
        }}
        >No contacts yet
        </Text>
        <Text style={{
          fontSize: 18,
          fontFamily: AppStyle.mainFontSemiBold,
          marginTop: 20,
          color: '#8A8D97'
        }}
        >
          Get started by adding your frst one.
        </Text>
      </View>
    )
  }

  _renderItem = ({ item, index }) => {
    return (
      <SwipeableItem
        style={{
          height: 71,
          backgroundColor: AppStyle.backgroundTextInput,
          borderBottomWidth: 1,
          borderColor: AppStyle.borderLinesSetting
        }}
        information={item}
        onItemPress={() => {
          if (!WalletStore.selectedIndex) {
            NavigationStore.showPopup('You have no wallet selected')
            return
          }
          if (!WalletStore.selectedWallet.canSendTransaction()) {
            NavigationStore.showPopup('This wallet can not send a transaction')
            return
          }
          sendStore.setSendingAddress(item.address)
        }}
        onDeleteItem={() => {
          NavigationStore.showBinaryPopup(
            'Are you sure you want to remove this contact?',
            {
              firstAction: {
                title: 'Cancel',
                action: () => {}
              },
              secondAction: {
                title: 'Delete',
                action: () => {
                  ContactStore.removeContact(item)
                }
              }
            }
          )
        }}
        onEditItem={() => {
          NavigationStore.navigateTo(ScreenID.AddContactScreen, { item, index })
        }}
      />
    )
  }

  _renderWalletList() {
    const contacts = ContactStore.contacts.slice()
    return (
      <FlatList
        style={{ flex: 1, marginTop: 30 }}
        data={contacts}
        ListEmptyComponent={this._renderNoAddressView()}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(itemChild, index) => `${index}`}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  _renderFooter = () => {
    const contacts = ContactStore.contacts.slice()
    let backgroundColor = { backgroundColor: AppStyle.backgroundContentDarkMode }
    if (contacts.length === 0) {
      backgroundColor = { backgroundColor: AppStyle.backgroundColor }
    }
    return (
      <TouchableOpacity
        style={[
          styles.addContactButtonStyle, backgroundColor
        ]}
        onPress={() => {
          NavigationStore.navigateTo(ScreenID.AddContactScreen)
        }}
      >
        <Image
          source={images.icon_addBold}
          style={{
            tintColor: AppStyle.mainColor,
            marginRight: 10,
            width: 23,
            height: 23,
            resizeMode: 'contain'
          }}
        />
        <Text
          style={styles.textOfButtonStyle}
        >Add New Address
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Address Book',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popToRootView()
          }}
        />
        {this._renderWalletList()}
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  contactImageStyle: {
    resizeMode: 'contain',
    width: 168,
    marginTop: 40
  },
  addContactButtonStyle: {
    flexDirection: 'row',
    height: 71,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textOfButtonStyle: {
    color: '#E4BF43',
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 18
  }
})
