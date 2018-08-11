import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import SwipeableItem from '../elements/SwipeableItem'
import WalletStore from '../../stores/WalletStore'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'
import Checker from '../../Handler/Checker';

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class ListWalletScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    onDeleted: PropsType.func,
    returnData: PropsType.func
  }

  static defaultProps = {
    onDeleted: () => { },
    returnData: () => { }
  }

  _renderItem = ({ item, index }) => {
    const {
      address,
      cardName
    } = item
    const {
      onDeleted
    } = this.props
    return (
      <SwipeableItem
        style={{
          height: 71,
          backgroundColor: AppStyle.backgroundTextInput,
          borderBottomWidth: 1,
          borderColor: AppStyle.borderLinesSetting
        }}
        information={{ address, name: cardName }}
        onItemPress={() => {

        }}
        onDeleteItem={() => {
          NavigationStore.showBinaryPopup(
            'Are you sure you want to remove this wallet?',
            {
              firstAction: {
                title: 'Cancel',
                action: () => { }
              },
              secondAction: {
                title: 'Delete',
                action: () => {
                  WalletStore.onRemoveWallet(index)
                  onDeleted()
                }
              }
            }
          )
        }}
        onEditItem={() => {
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
                  const walletEdited = {
                    ...item,
                    balance: item.balanceValue,
                    cardName: text || item.cardName
                  }
                  WalletStore.editWallet(walletEdited, index)
                }
              }
            },
            'Enter your wallet name',
            'input'
          )
        }}
      />
    )
  }

  returnData = (isCreateSuccess, index, isCreate) => {
    const { returnData } = this.props
    if (isCreateSuccess) {
      returnData(isCreateSuccess, index, isCreate)
    }
  }

  _renderAddressList() {
    const wallets = WalletStore.dataCards
    return (
      <FlatList
        style={{ flex: 1, marginTop: 30 }}
        data={wallets}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  _renderContentView() {
    return this._renderAddressList()
  }

  _renderFooter = () => {
    const wallets = WalletStore.dataCards
    if (wallets.length === 5) {
      return null
    }
    return (
      <TouchableOpacity
        style={[
          styles.addContactButtonStyle
        ]}
        onPress={() => {
          NavigationStore.navigateTo(ScreenID.CreateWalletScreen, {
            returnData: this.returnData,
            index: WalletStore.dataCards.length
          })
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
        >Add New Wallet
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
            title: 'Wallets',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popToRootView()
          }}
        />
        {this._renderContentView()}
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  addContactButtonStyle: {
    flexDirection: 'row',
    height: 71,
    backgroundColor: AppStyle.backgroundContentDarkMode,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textOfButtonStyle: {
    color: '#E4BF43',
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 18
  }
})
