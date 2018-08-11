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
import SwitchButton from '../elements/SwitchButton'
import ManageWalletItem from '../elements/ManageWalletItem'
import SwipeableItem from '../elements/SwipeableItem'
import LayoutUtils from '../../../commons/LayoutUtils'
import StringHandler from '../../../Handler/StringHandler'
import Network from '../../../Network'
import images from '../../../commons/images'
import NotificationStore from '../../../stores/NotificationStore'
import AppStyle from '../../../commons/AppStyle'
import SettingStore from '../../../stores/SettingStore'

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const extraBottom = LayoutUtils.getExtraBottom()

@observer
export default class SettingScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    onDeleted: PropTypes.func,
    onCreated: PropTypes.func
  }

  static defaultProps = {
    navigation: {},
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

  componentDidMount() {
    SettingStore.navigator = this.props.navigation
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
    const { navigation } = this.props
    // const { currentNetwork } = NetworkStore
    const currentNetwork = Network.MainNet
    const networkName = StringHandler.toCapitalize(currentNetwork)
    return (
      <TouchableOpacity onPress={() => { navigation.navigate('NetworkScreen') }}>
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

  handleEditWallet = () => {
    // NavStore.popupCustom.show(
    //   'Wallet Name',
    //   [
    //     {
    //       text: 'Cancel',
    //       onClick: () => {
    //         NavStore.popupCustom.hide()
    //       }
    //     },
    //     {
    //       text: 'OK',
    //       onClick: (text) => {
    //         this.swipeWalletsSetting = []
    //         const walletEdited = {
    //           ...item,
    //           balance: item.balanceValue,
    //           cardName: text || item.cardName
    //         }
    //         WalletStore.editWallet(walletEdited, index)
    //           .then(() => NavStore.popupCustom.hide())
    //       }
    //     }
    //   ],
    //   'Enter your wallet name',
    //   'input',
    //   false,
    //   item.cardName
    // )
  }

  handleDeleteWallet = () => {
    // NavStore.popupCustom.show(
    //   'Are you sure you want to remove this wallet ?',
    //   [
    //     {
    //       text: 'Cancel',
    //       onClick: () => {
    //         NavStore.popupCustom.hide()
    //       }
    //     },
    //     {
    //       text: 'Delete',
    //       onClick: () => {
    //         this.swipeContactsSetting = []
    //         WalletStore.onRemoveWallet(index)
    //         onDeleted()
    //         NavStore.popupCustom.hide()
    //       }
    //     }
    //   ]
    // )
  }

  _renderItemManageWallet = ({ item, index }) => {
    const { onDeleted } = this.props
    return (
      <ManageWalletItem
        ref={(ref) => { this.swipeWalletsSetting.push(ref) }}
        wallet={item}
        onEditPress={this.handleEditWallet}
        onDeletePress={this.handleDeleteWallet}
      />
    )
  }

  handlePressContactItem = () => {
    // if (!WalletStore.selectedIndex) {
    //   NavStore.popupCustom.show('You have no wallet selected')
    //   return
    // }
    // if (!WalletStore.selectedWallet.canSendTransaction()) {
    //   NavStore.popupCustom.show('This wallet can not send a transaction')
    //   return
    // }
    // sendStore.setSendingAddress(item.address)
    // NavStore.openModal()
  }

  handleDeleteContact = () => {
    // NavStore.popupCustom.show(
    //   'Are you sure you want to remove this contact ?',
    //   [
    //     {
    //       text: 'Cancel',
    //       onClick: () => {
    //         NavStore.popupCustom.hide()
    //       }
    //     },
    //     {
    //       text: 'Delete',
    //       onClick: () => {
    //         ContactStore.removeContact(item)
    //         NavStore.popupCustom.hide()
    //       }
    //     }
    //   ]
    // )
  }

  handleEditContact = () => {
    // navigation.navigate('AddContactScreen', { item, index })
  }

  _renderContactItem = ({ item, index }) => {
    const { navigation } = this.props
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
        onItemPress={this.handlePressContactItem}
        onDeleteItem={this.handleDeleteContact}
        onEditItem={this.handleEditContact}
      />
    )
  }

  _renderFooterContactList() {
    const { navigation } = this.props
    const textButton = 'Add New Address'

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddContactScreen', {})
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
      // WalletStore.setSelectedIndex(index)
      // WalletStore.cacheListOriginalWallet()
      // const wallet = WalletStore.dataCards[index]
      // setTimeout(() => {
      //   if (isCreate) {
      //     TokenStore.initDataWalletWhenCreate(wallet.address)
      //     NavStore.showToastTop(
      //       'Your wallet was successfully created!',
      //       {},
      //       { color: AppStyle.colorUp }
      //     )
      //   }
      //   this.props.navigation.navigate('TokenScreen', {
      //     currentIndex: index,
      //     card: wallet,
      //     isCreate
      //   })
      // }, 250)
    }
  }

  _renderFooterManageWallet() {
    const { navigation } = this.props
    const textButton = 'Add New Wallet'
    // const wallets = WalletStore.dataCards

    // if (wallets.length === 5) {
    //   return null
    // }

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateWalletStack', {
            returnData: this.returnData,
            // index: WalletStore.dataCards.length
            index: 0
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
    const { navigation, onDeleted } = this.props
    const dataSettingAbout = SettingStore.settingAbout
    const dataSettingSecurity = SettingStore.listSettingSecurity

    // const wallets = WalletStore.dataCards
    // const dataWalletsSetting = wallets.slice(0, 3)
    // const totalWallets = wallets.length
    const dataWalletsSetting = []
    const totalWallets = 0

    // const contacts = ContactStore.contacts.slice()
    // const dataContactsSetting = contacts.slice(0, 3)
    // const totalContacts = contacts.length
    const dataContactsSetting = []
    const totalContacts = 0

    return (
      <ScrollView
        style={styles.container}
      >
        <View style={styles.container}>
          <View style={[styles.rowTitle, { paddingTop: 15 }]}>
            <Text style={styles.textTitle}>Manage your wallet</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ListWalletScreen', {
                  onDeleted,
                  returnData: this.returnData
                })
              }}
            >
              <Text style={styles.textViewAll}>{totalWallets > 3 ? 'View All' : ''}</Text>
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
                navigation.navigate('AddressBookScreen')
              }}
            >
              <Text style={styles.textViewAll}>{totalContacts > 3 ? 'View All' : ''}</Text>
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
          {this._renderTitleView('Security')}
          <FlatList
            data={dataSettingSecurity}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            scrollEnabled={false}
            renderItem={this._renderItemSecurity}
          />
          {/* {this._renderTitleView('Network')}
          {this._renderNetworkItem()} */}
          {this._renderTitleView('About')}
          <FlatList
            data={dataSettingAbout}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `${index}`}
            scrollEnabled={false}
            renderItem={this._renderItemAbout}
          />
          {this._renderTitleView('Notification')}
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
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor
  },
  textViewAll: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
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
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.secondaryTextColor
  },
  textVersion: {
    color: AppStyle.mainTextColor,
    fontSize: 12,
    fontFamily: 'OpenSans-Semibold'
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
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainColor,
    marginLeft: 14
  }
})
