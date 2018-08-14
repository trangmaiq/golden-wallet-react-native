import React, { Component } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropsType from 'prop-types'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import AddressBookItem from '../elements/AddressBookItem'
import MainStore from '../../../AppStores/MainStore'
import ActionSheetCustom from '../../../components/elements/ActionSheetCustom'
import NavStore from '../../../stores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class AddressBookScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  onActionPress = (index) => {
    this.selectedAB = this.addressBooks[index]
    this.actionSheet.show()
  }

  onCancelAction = () => {
    this.actionSheet.hide()
  }

  onEdit = () => {
    NavStore.popupCustom.show(
      'Address Book',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'OK',
          onClick: async (text) => {
            const addressBook = this.selectedAB
            addressBook.title = text
            await this.selectedAB.update()
            MainStore.appState.syncAddressBooks()
            NavStore.popupCustom.hide()
            this.actionSheet.hide()
          }
        }
      ],
      'Enter your address name',
      'input'
    )
  }

  onDelete = () => {
    NavStore.popupCustom.show(
      'Are you sure you want to delete this address book ?',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Delete',
          onClick: async () => {
            await this.selectedAB.delete()
            MainStore.appState.syncAddressBooks()
            NavStore.popupCustom.hide()
            this.actionSheet.hide()
          }
        }
      ]
    )
  }

  get addressBooks() {
    return MainStore.appState.addressBooks
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

  _renderItem = ({ item, index }) =>
    (
      <AddressBookItem index={index} action={() => { this.onActionPress(index) }} />
    )

  _renderAddressBook() {
    const { addressBooks } = this
    return (
      <FlatList
        style={{ flex: 1, marginTop: 30 }}
        data={addressBooks}
        ListEmptyComponent={this._renderNoAddressView()}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(itemChild, index) => `${index}`}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  _renderFooter = () => {
    const { navigation } = this.props
    const { addressBooks } = this
    let backgroundColor = { backgroundColor: AppStyle.backgroundContentDarkMode }
    if (addressBooks.length === 0) {
      backgroundColor = { backgroundColor: AppStyle.backgroundColor }
    }
    return (
      <TouchableOpacity
        style={[
          styles.addContactButtonStyle, backgroundColor
        ]}
        onPress={() => {
          navigation.navigate('AddAddressBookScreen')
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
    const { navigation } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => { this.actionSheet.hide() }}>
        <SafeAreaView style={styles.container}>
          <NavigationHeader
            style={{ marginTop: 20 + marginTop }}
            headerItem={{
              title: 'Address Book',
              icon: null,
              button: images.backButton
            }}
            action={() => {
              navigation.dispatch(NavigationActions.back())
            }}
          />
          {this._renderAddressBook()}
          <ActionSheetCustom ref={(ref) => { this.actionSheet = ref }} onCancel={this.onCancelAction}>
            <TouchableOpacity onPress={this.onEdit}>
              <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
                <Text style={[styles.actionText, { color: '#4A90E2' }]}>Edit Address Name</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onDelete}>
              <View style={styles.actionButton}>
                <Text style={[styles.actionText, { color: AppStyle.colorDown }]}>Delete Address</Text>
              </View>
            </TouchableOpacity>
          </ActionSheetCustom>
        </SafeAreaView >
      </TouchableWithoutFeedback>
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
  },
  actionButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width - 40,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  }
})
