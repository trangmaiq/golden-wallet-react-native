import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import DeviceInfo from 'react-native-device-info'
import SettingStore from '../../stores/SettingStore'
import AppStyle from '../../commons/AppStyle'
import SwitchButton from '../elements/SwitchButton'
import ManageWalletItem from '../elements/ManageWalletItem'
import images from '../../commons/images'
import WalletStore from '../../stores/WalletStore'
import ContactStore from '../../stores/ContactStore'
import SwipeableItem from '../elements/SwipeableItem'
import NetworkStore from '../../stores/NetworkStore'
import StringHandler from '../../Handler/StringHandler'
import LayoutUtils from '../../commons/LayoutUtils'
import TokenStore from '../../stores/AddressTokenStore'
import NotificationStore from '../../stores/NotificationStore'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'
import Checker from '../../Handler/Checker'

const extraBottom = LayoutUtils.getExtraBottom()

const Title = {
  Support: 'Support',
  Network: 'Network',
  Security: 'Security',
  About: 'About',
  Notification: 'Notification'
}

const ActionTitle = {
  Cancel: 'Cancel',
  Delete: 'Delete',
  AddNewWallet: 'Add New Wallet',
  AddNewAddress: 'Add New Address',
  ViewAll: 'View All'
}

@observer
export default class SettingScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    onDeleted: PropTypes.func,
    onCreated: PropTypes.func
  }

  static defaultProps = {
    onDeleted: () => { },
    onCreated: () => { }
  }

  constructor(props) {
    super(props)
    this.swipeWalletsSetting = []
    this.swipeContactsSetting = []
    SettingStore.setupSecurityValue()
  }

  state = {
    manageWalletHeight: new Animated.Value(0),
    isShowManageWallet: false
  }

  getBorderTop(index) {
    return index === 0 ? 0 : 1
  }

  _renderTitleView = (title) => {
    return (
      <View style={styles.rowTitle}>
        <Text style={styles.textTitle}>{title}</Text>
      </View>
    )
  }

  _renderItemAbout = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <View style={[styles.rowSubtitle, { borderTopWidth: this.getBorderTop(index) }]}>
          <Text style={styles.textSubtitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderNetworkItem = () => {
    const { currentNetwork } = NetworkStore
    const networkName = StringHandler.toCapitalize(currentNetwork)
    return (
      <TouchableOpacity onPress={() => { NavigationStore.navigateTo(ScreenID.NetworkScreen) }}>
        <View style={[styles.rowSubtitle]}>
          <Text style={styles.textSubtitle}>{networkName}</Text>
          <Image source={images.icon_indicator} />
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemSecurity = ({ item, index }) => {
    return (
      <View style={[styles.rowSubtitle, { borderTopWidth: this.getBorderTop(index) }]}>
        <Text style={styles.textSubtitle}>{item.title}</Text>
        <SwitchButton
          enable={item.value}
          onStateChange={(isActive) => {
            SettingStore.saveSercurity(index, isActive)
          }}
        />
      </View>
    )
  }

  _renderNotificationItem = () => {
    return (
      <View style={[styles.rowSubtitle]}>
        <Text style={styles.textSubtitle}>Enable Notification</Text>
        <SwitchButton
          enable={NotificationStore.enable}
          onStateChange={() => {
            NotificationStore.changeStateUseNotification()
          }}
        />
      </View>
    )
  }

  _startAnimationManageWallet(value) {
    Animated.timing(
      this.state.manageWalletHeight,
      {
        toValue: this.state.isShowManageWallet ? value : 0,
        duration: 250
      }
    ).start()
  }

  _turnOffSwipe() {
    this.swipeWalletsSetting.forEach((swipe) => {
      if (!swipe) return
      swipe._turnOffSwipe()
    })
    this.swipeContactsSetting.forEach((swipe) => {
      if (!swipe) return
      swipe._turnOffSwipe()
    })
  }

  _renderItemManageWallet = ({ item, index }) => {
    const { onDeleted } = this.props
    return (
      <ManageWalletItem
        ref={(ref) => { this.swipeWalletsSetting.push(ref) }}
        wallet={item}
        onEditPress={() => {
          NavigationStore.showBinaryPopup(
            'Wallet Name',
            {
              firstAction: {
                title: 'Cancel',
                action: () => { }
              },
              secondAction: {
                title: 'OK',
                action: (text) => {
                  if (Checker.checkExistName(text, index)) {
                    setTimeout(() => {
                      NavigationStore.showPopup('Wallet\'s name is existed')
                    }, 200)
                    return
                  }
                  this.swipeWalletsSetting = []
                  const walletEdited = {
                    ...item,
                    balance: item.balanceValue,
                    cardName: text || item.cardName
                  }
                  WalletStore.editWallet(walletEdited, index)
                    .then(() => { })
                }
              }
            },
            'Enter your wallet name',
            'input'
          )
        }}
        onDeletePress={() => {
          NavigationStore.showBinaryPopup(
            'Are you sure you want to remove this wallet?',
            {
              firstAction: {
                title: ActionTitle.Cancel,
                action: () => { }
              },
              secondAction: {
                title: ActionTitle.Delete,
                action: () => {
                  this.swipeContactsSetting = []
                  WalletStore.onRemoveWallet(index)
                  onDeleted()
                }
              }
            }
          )
        }}
      />
    )
  }

  _renderContactItem = ({ item, index }) => {
    return (
      <SwipeableItem
        ref={(ref) => { this.swipeContactsSetting.push(ref) }}
        style={{
          backgroundColor: AppStyle.backgroundTextInput,
          borderBottomWidth: 1,
          borderColor: AppStyle.borderLinesSetting,
          height: 71
        }}
        information={item}
        onItemPress={() => { }}
        onDeleteItem={() => {
          NavigationStore.showBinaryPopup(
            'Are you sure you want to remove this contact ?',
            {
              firstAction: {
                title: ActionTitle.Cancel,
                action: () => { }
              },
              secondAction: {
                title: ActionTitle.Delete,
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

  _renderFooterContactList() {
    const textButton = ActionTitle.AddNewAddress

    return (
      <TouchableOpacity
        onPress={() => {
          NavigationStore.navigateTo(ScreenID.AddContactScreen, {})
        }}
      >
        <View style={styles.footerField}>
          <Image
            style={{
              tintColor: AppStyle.mainColor
            }}
            source={images.iconAdd}
          />
          <Text style={styles.footerText}>{textButton}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  returnData = (isCreateSuccess, index, isCreate, isAddress) => {
    const { onCreated } = this.props
    if (isCreateSuccess) {
      onCreated(index, isCreate, isAddress)
      WalletStore.setSelectedIndex(index)
      WalletStore.cacheListOriginalWallet()
      const wallet = WalletStore.dataCards[index]
      setTimeout(() => {
        if (isCreate) {
          TokenStore.initDataWalletWhenCreate(wallet.address)
        }
        NavigationStore.navigateTo(ScreenID.TokenScreen, {
          currentIndex: index,
          card: wallet,
          isCreate
        })
      }, 250)
    }
  }

  _renderFooterManageWallet() {
    const textButton = ActionTitle.AddNewWallet
    const wallets = WalletStore.dataCards

    if (wallets.length === 5) {
      return null
    }

    return (
      <TouchableOpacity
        onPress={() => {
          NavigationStore.showModal(ScreenID.CreateWalletScreen, {
            returnData: this.returnData,
            index: WalletStore.dataCards.length
          })
        }}
      >
        <View style={styles.footerField}>
          <Image
            style={{
              tintColor: AppStyle.mainColor
            }}
            source={images.iconAdd}
          />
          <Text style={styles.footerText}>{textButton}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderFooter = () => {
    return (
      <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 + extraBottom }}>
        <Text style={styles.textVersion}>{`Version ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`}</Text>
      </View>
    )
  }

  render() {
    const { onDeleted } = this.props
    const dataSettingAbout = SettingStore.settingAbout
    const dataSettingSecurity = SettingStore.listSettingSecurity

    const wallets = WalletStore.dataCards
    const dataWalletsSetting = wallets.slice(0, 3)
    const totalWallets = wallets.length

    const contacts = ContactStore.contacts.slice()
    const dataContactsSetting = contacts.slice(0, 3)
    const totalContacts = contacts.length

    return (
      <ScrollView
        style={styles.container}
      >
        <View style={styles.container}>
          <View style={[styles.rowTitle, { paddingTop: 15 }]}>
            <Text style={styles.textTitle}>Manage your wallet</Text>
            <TouchableOpacity
              onPress={() => {
                NavigationStore.navigateTo(ScreenID.ListWalletScreen, {
                  onDeleted,
                  returnData: this.returnData
                })
              }}
            >
              <Text style={styles.textViewAll}>{totalWallets > 3 ? ActionTitle.ViewAll : ''}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={dataWalletsSetting}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            renderItem={this._renderItemManageWallet}
            scrollEnabled={false}
          />
          {this._renderFooterManageWallet()}
          <View style={styles.rowTitle}>
            <Text style={styles.textTitle}>Address Book</Text>
            <TouchableOpacity
              onPress={() => {
                NavigationStore.navigateTo(ScreenID.AddressBookScreen)
              }}
            >
              <Text style={styles.textViewAll}>{totalContacts > 3 ? ActionTitle.ViewAll : ''}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={dataContactsSetting}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            renderItem={this._renderContactItem}
            scrollEnabled={false}
          />
          {this._renderFooterContactList()}
          {this._renderTitleView(Title.Security)}
          <FlatList
            data={dataSettingSecurity}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            scrollEnabled={false}
            renderItem={this._renderItemSecurity}
          />
          {/* {this._renderTitleView(Title.Network)} */}
          {/* {this._renderNetworkItem()} */}
          {this._renderTitleView(Title.Support)}
          <FlatList
            data={dataSettingAbout}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            scrollEnabled={false}
            renderItem={this._renderItemAbout}
          />
          {this._renderTitleView(Title.Notification)}
          {this._renderNotificationItem()}
        </View>
        {this._renderFooter()}
      </ScrollView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between'
  },
  textTitle: {
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.mainTextColor
  },
  textViewAll: {
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.mainColor
  },
  rowSubtitle: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundTextInput,
    borderColor: AppStyle.borderLinesSetting,
    justifyContent: 'space-between'
  },
  textSubtitle: {
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.secondaryTextColor
  },
  textVersion: {
    color: AppStyle.mainTextColor,
    fontSize: 12,
    fontFamily: AppStyle.mainFontSemiBold
  },
  footerField: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyle.backgroundTextInput
  },
  footerText: {
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.mainColor,
    marginLeft: 14
  }
})
