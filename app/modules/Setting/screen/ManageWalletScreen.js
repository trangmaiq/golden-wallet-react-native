import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import ManageWalletItem from '../elements/ManageWalletItem'
import MainStore from '../../../AppStores/MainStore'
import ActionSheetCustom from '../../../components/elements/ActionSheetCustom'
import NavStore from '../../../stores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class ListWalletScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  onActionPress = (index) => {
    this.selectedWallet = this.wallets[index]
    this.actionSheet.show()
  }

  onCancelAction = () => {
    this.actionSheet.hide()
  }

  onEdit = () => {
    NavStore.popupCustom.show(
      'Wallet',
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
            this.selectedWallet.title = text
            await this.selectedWallet.update()
            MainStore.appState.syncWallets()
            NavStore.popupCustom.hide()
            this.actionSheet.hide()
          }
        }
      ],
      'Enter your wallet name',
      'input'
    )
  }

  onDelete = () => {
    NavStore.popupCustom.show(
      'Are you sure you want to remove this wallet ?',
      [
        {
          text: 'Cancel',
          onClick: () => {
            NavStore.popupCustom.hide()
          }
        },
        {
          text: 'Remove',
          onClick: async () => {
            const { wallets, selectedWallet } = MainStore.appState
            const index = wallets.indexOf(selectedWallet)
            if (index === wallets.length - 1) {
              MainStore.appState.setSelectedWallet(null)
            }
            await this.selectedWallet.remove()
            MainStore.appState.syncWallets()
            NavStore.popupCustom.hide()
            this.actionSheet.hide()
          }
        }
      ]
    )
  }

  get wallets() {
    return MainStore.appState.wallets
  }

  _renderItem = ({ item, index }) =>
    (
      <ManageWalletItem index={index} action={() => { this.onActionPress(index) }} />
    )

  returnData = (isCreateSuccess, index, isCreate) => {
    const { navigation } = this.props
    if (isCreateSuccess) {
      navigation.state.params.returnData(isCreateSuccess, index, isCreate)
    }
  }

  _renderAddressList() {
    const { wallets } = this
    return (
      <FlatList
        style={{ flex: 1, marginTop: 15 }}
        data={wallets}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item.address}
        renderItem={this._renderItem}
        ListFooterComponent={this._renderFooter}
      />
    )
  }

  _renderContentView() {
    return this._renderAddressList()
  }

  _renderFooter = () => {
    const { navigation } = this.props
    const { wallets } = this
    if (wallets.length === 5) {
      return null
    }
    return (
      <TouchableOpacity
        style={[
          styles.addContactButtonStyle
        ]}
        onPress={() => {
          navigation.navigate('CreateWalletStack', {
            returnData: this.returnData,
            index: wallets.length
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
    const { navigation } = this.props
    return (
      <TouchableWithoutFeedback onPress={() => { this.actionSheet.hide() }}>
        <SafeAreaView style={styles.container}>
          <NavigationHeader
            style={{ marginTop: 20 + marginTop }}
            headerItem={{
              title: 'Wallets',
              icon: null,
              button: images.backButton
            }}
            action={() => {
              navigation.dispatch(NavigationActions.back())
            }}
          />
          {this._renderContentView()}
          <ActionSheetCustom ref={(ref) => { this.actionSheet = ref }} onCancel={this.onCancelAction}>
            <TouchableOpacity onPress={this.onEdit}>
              <View style={[styles.actionButton, { borderBottomWidth: 1, borderColor: AppStyle.borderLinesSetting }]}>
                <Text style={[styles.actionText, { color: '#4A90E2' }]}>Edit Wallet Name</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onDelete}>
              <View style={styles.actionButton}>
                <Text style={[styles.actionText, { color: AppStyle.colorDown }]}>Remove Wallet</Text>
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
