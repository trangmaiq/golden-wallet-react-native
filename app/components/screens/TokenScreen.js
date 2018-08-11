import React, { Component } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import debounce from 'lodash.debounce'
import NavigationHeader from '../elements/NavigationHeader'
import TokenItem from '../elements/TokenItem'
import images from '../../commons/images'
import AddressTokenStore from '../../stores/AddressTokenStore'
import Helper from '../../commons/Helper'
import InformationCard from '../elements/InformationCard'
import AppStyle from '../../commons/AppStyle'
import WalletStore from '../../stores/WalletStore'
import LayoutUtils from '../../commons/LayoutUtils'
import sendTransactionStore from '../../modules/SendTransaction/stores/SendTransactionStore'
import constant from '../../commons/constant'
import ShimmerTokenItem from '../elements/ShimmerTokenItem'
import TransactionStore from '../../stores/TransactionStore'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class TokenScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    card: PropsType.object,
    currentIndex: PropsType.number,
    isCreate: PropsType.bool
  }

  static defaultProps = {
    card: {
      cardName: ' ',
      address: ' ',
      balanceValue: 0
    },
    currentIndex: 0,
    isCreate: false
  }

  componentDidMount() {
    const { card, isCreate } = this.props
    const { address, balanceValue } = card
    AddressTokenStore.setupStore(address, balanceValue)
    if (isCreate && !WalletStore.isBackup) {
      setTimeout(() => {
        NavigationStore.showBinaryPopup(
          constant.WARNING,
          {
            firstAction: {
              title: 'Later',
              action: () => { }
            },
            secondAction: {
              title: 'Backup Now',
              action: () => {
                NavigationStore.navigateTo(ScreenID.BackupScreen)
              }
            }
          },
          constant.BACKUP_DESCRIPTION
        )
      }, 1000)
    }
  }

  _handleSecretBalance = debounce((wallet, index) => {
    WalletStore.editWallet(wallet, index)
  }, 100)

  _handleSmallBalance = debounce((wallet, index) => {
    WalletStore.editWallet(wallet, index)
  }, 100)

  _renderHideShowBalanceButton = (item, currentIndex, enableSmallAssets) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          backgroundColor: '#131734',
          paddingVertical: 8,
          paddingHorizontal: 20,
          marginTop: 30
        }}
        onPress={() => {
          const card = item
          card.enableSmallAssets = !enableSmallAssets
          this._handleSmallBalance(card, currentIndex)
        }}
      >
        <Image
          source={images.iconHideShowBalance}
          style={{
            resizeMode: 'contain',
            width: 24,
            marginTop: 2
          }}
          tintColor="white"
        />
        <Text style={{
          flex: 1,
          color: '#E5E5E5',
          fontFamily: AppStyle.mainFontSemiBold,
          fontSize: 14,
          marginLeft: 8
        }}
        >
          {enableSmallAssets
            ? 'Hide small Balances'
            : 'Show small Balances'
          }
        </Text>
      </TouchableOpacity>
    )
  }

  _renderFooter = () => {
    return <ShimmerTokenItem />
  }

  _renderHeader = (card, currentIndex, totalETH, totalUSD, enableSmallAssets) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <InformationCard
          data={{
            cardItem: card,
            index: currentIndex,
            titleText: 'Estimated Value',
            mainSubTitleText: `${Helper.formatETH(totalETH)} ETH`,
            viceSubTitleText: `$${Helper.formatUSD(totalUSD)}`
          }}
          style={{
            marginTop: 15,
            marginHorizontal: 20
          }}
          titleStyle={{
            color: AppStyle.Color.silverColor,
            fontSize: 18,
            fontFamily: AppStyle.mainFont
          }}
          mainSubTitleStyle={{
            color: AppStyle.mainColor,
            fontSize: 30,
            fontFamily: AppStyle.mainFontBold
          }}
          viceSubTitleStyle={{
            color: AppStyle.Color.silverColor,
            fontSize: 16,
            fontFamily: AppStyle.mainFont,
            marginLeft: 8
          }}
        />
      </View>
    )
  }

  render() {
    const { card, currentIndex } = this.props
    const {
      cardName,
      address,
      balanceValue
    } = card

    const dataTokens = AddressTokenStore.getTokenAddress
    const {
      tokens = [],
      totalETH = 0,
      totalUSD = 0
    } = dataTokens

    const { enableSmallAssets = true } = card
    const dataShow = tokens

    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: cardName,
            icon: null,
            button: images.backButton
          }}
          action={() => {
            WalletStore.fetchBalanceAllWallet()
            NavigationStore.popView()
            setTimeout(() => {
              AddressTokenStore.clearSelectedAddress()
            }, 250)
          }}
        />
        <FlatList
          style={{
            flex: 1
          }}
          ListHeaderComponent={
            this._renderHeader(card, currentIndex, totalETH, totalUSD, enableSmallAssets)
          }
          ListFooterComponent={this._renderFooter}
          data={dataShow}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          refreshing={AddressTokenStore.isRefreshing}
          onRefresh={async () => {
            AddressTokenStore.setRefreshing(true)
            AddressTokenStore.setupStore(address, balanceValue)
          }}
          renderItem={({ item, index }) => {
            return (
              <TokenItem
                style={{
                  backgroundColor: AppStyle.backgroundContentDarkMode,
                  paddingLeft: 10,
                  paddingRight: 15,
                  marginBottom: 15,
                  borderRadius: 5
                }}
                title={item.title}
                subtitle={item.subtitle}
                numberEther={item.title == 'ETH' ? Helper.formatETH(item.balance) : Helper.formatCommaNumber(item.balance)}
                dollaEther={Helper.formatUSD(item.balanceUSD)}
                randomColor={item.randomColor}
                onPress={() => {
                  NavigationStore.navigateTo(ScreenID.TransactionDetailScreen, {
                    address,
                    name: cardName,
                    dataToken: item,
                    addressToken: item.address
                  })
                  sendTransactionStore.selectedToken = { address: item.address, title: item.title }
                  const selectedTokenKey = address === item.address ? address : `${address} - ${item.address}`
                  TransactionStore.setSelectedToken(selectedTokenKey.toLowerCase())
                }}
              />)
          }}
        />
      </View>
    )
  }
}
