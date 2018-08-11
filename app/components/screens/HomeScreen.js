import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Animated
} from 'react-native'

import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel'
import { observer } from 'mobx-react/native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import LargeCard from '../elements/LargeCard'
import Hamburger from '../elements/HamburgerButton'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'
import SettingScreen from './SettingScreen'
import WalletStore from '../../stores/WalletStore'
import HomeSendButton from '../elements/HomeSendButton'
import LayoutUtils from '../../commons/LayoutUtils'
import CurrencyStore from '../../stores/CurrencyStore'
import sendTransactionStore from '../../modules/SendTransaction/stores/SendTransactionStore'
import Ticker from './../elements/Ticker'
import TickerStore from './../../stores/TickerStore'
import NotificationListenter from '../../NotificationListener'
import NotificationStore from '../../stores/NotificationStore'
// Navigation
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'
import StateListener from '../../navigation/AppState'
import TokenStore from '../../stores/AddressTokenStore'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const heightCarousel = height - 200 - marginTop + 60

@observer
export default class HomeScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  constructor(props) {
    super(props)
    NotificationListenter.registerAppListener()
    this.state = {
      translateY: new Animated.Value(0)
    }
  }

  componentDidMount() {
    StateListener.start()
    TickerStore.callApi()
    this.index = 0
    this.shouldShowSuccess = true
    setTimeout(() => {
      if (!NotificationStore.isInitFromNotification) {
        NavigationStore.showModal(ScreenID.UnlockScreen, {
          isLaunchApp: true,
          onUnlock: () => {
            setTimeout(() => {
              this._gotoCreateWallet()
            }, 900)
          }
        }, true)
      } else {
        NavigationStore.navigateTo(ScreenID.TransactionDetailScreen, NotificationStore.transactionFromNotif)
      }
    }, 200)
  }

  _shouldShowSendButton(cards) {
    if (cards.length === 0) {
      return false
    }
    return cards[0].privateKey !== undefined && cards[0].privateKey !== ''
  }

  returnData = (isCreateSuccess, index, isCreate = false, isAddress = false) => {
    if (isCreateSuccess) {
      WalletStore.setSelectedIndex(index)
      WalletStore.cacheListOriginalWallet()
      const wallet = WalletStore.dataCards[index]
      this.sendButton._toggleSendButton(isCreateSuccess && !isAddress)
      setTimeout(() => {
        if (isCreate) {
          TokenStore.initDataWalletWhenCreate(wallet.address)
          // NavigationStore.showToast('Your wallet was successfully created!', { color: AppStyle.colorUp })
        }
        NavigationStore.navigateTo(ScreenID.TokenScreen, {
          currentIndex: index,
          card: wallet,
          isCreate
        })
      }, 250)
    }
  }

  _renderSendButton = (cards) => {
    return (
      <HomeSendButton
        ref={(ref) => { this.sendButton = ref }}
        isShow={this._shouldShowSendButton(cards)}
        action={() => {
          if (WalletStore.selectedWallet) {
            if (WalletStore.selectedWallet.canSendTransaction()) {
              NavigationStore.showModal(ScreenID.SendTransactionScreen)
              const wl = WalletStore.selectedWallet
              const wallet = {
                address: wl.address,
                postfix: 'ETH',
                balanceCrypto: WalletStore.selectedWallet.balanceETH || 0,
                balanceUSD: WalletStore.selectedWallet.balanceETH * CurrencyStore.currencyUSD || 0,
                ratio: CurrencyStore.currencyUSD
              }
              sendTransactionStore.setWallet(wallet)
              sendTransactionStore.selectedToken = { title: 'ETH' }
            } else {
              NavigationStore.showPopup('This wallet can not send a transaction')
            }
          } else {
            NavigationStore.showPopup('You have no wallet selected')
          }
        }}
      />
    )
  }

  _gotoCreateWallet() {
    NavigationStore.showModal(ScreenID.CreateWalletScreen, {
      returnData: this.returnData,
      index: WalletStore.dataCards.length
    })
  }

  _renderCard = ({ item, index }) => {
    return (
      <LargeCard
        isNew={index === WalletStore.dataCards.length}
        cardItem={item}
        index={index}
        style={{ margin: 5, marginTop: 20 }}
        onPress={() => {
          if (index !== WalletStore.dataCards.length) {
            WalletStore.enableSecretBalance = item.enableSecretBalance
            NavigationStore.navigateTo(ScreenID.TokenScreen, {
              currentIndex: index,
              card: item
            })
          } else {
            this._gotoCreateWallet()
          }
        }}
        onAddPrivateKey={() => {
          NavigationStore.navigateTo(ScreenID.AddPrivateKeyScreen, {
            wallet: item,
            index,
            returnData: this.returnData
          })
        }}
      />
    )
  }

  stackScrollInterpolator = (index, carouselProps) => {
    const range = [1, 0, -1, -2, -3]
    const inputRange = getInputRangeFromIndexes(range, index, carouselProps)
    const outputRange = range
    return { inputRange, outputRange }
  }

  stackAnimatedStyles = (index, animatedValue, carouselProps) => {
    const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth
    const translateProp = carouselProps.vertical ? 'translateY' : 'translateX'

    const cardOffset = 18
    const card1Scale = 0.9
    const card2Scale = 0.8

    const getTranslateFromScale = (index2, scale) => {
      const centerFactor = 1 / scale * index2
      const centeredPosition = -Math.round(sizeRef * centerFactor)
      const edgeAlignment = Math.round((sizeRef - (sizeRef * scale)) / 2)
      const offset = Math.round(cardOffset * Math.abs(index2) / scale)

      return centeredPosition - edgeAlignment - offset
    }

    return {
      opacity: animatedValue.interpolate({
        inputRange: [-3, -2, -1, 0],
        outputRange: [0, 0.5, 0.75, 1],
        extrapolate: 'clamp'
      }),
      transform: [{
        scale: animatedValue.interpolate({
          inputRange: [-2, -1, 0, 1],
          outputRange: [card2Scale, card1Scale, 1, card1Scale],
          extrapolate: 'clamp'
        })
      }, {
        [translateProp]: animatedValue.interpolate({
          inputRange: [-3, -2, -1, 0, 1],
          outputRange: [
            getTranslateFromScale(-3, card2Scale),
            getTranslateFromScale(-2, card2Scale),
            getTranslateFromScale(-1, card1Scale),
            0,
            sizeRef * 0.5
          ],
          extrapolate: 'clamp'
        })
      }]
    }
  }

  checkPrivateKey(privateKey) {
    return privateKey !== undefined && privateKey !== ''
  }

  render() {
    const {
      translateY
    } = this.state
    const changeOpacityListCoin = translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    const changeOpacitySetting = translateY.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    let cards = WalletStore.dataCards.slice()
    if (cards.length < 5) {
      cards = [...cards, {
        balance: '0 ETH',
        balanceUSD: '$0',
        address: '0'
      }]
    }
    const tickers = TickerStore.tickers.slice()

    return (
      <View style={styles.container}>
        <View style={styles.homeHeader}>
          <Hamburger
            onPressHamburger={(isShow) => {
              if (!isShow) {
                this.settingScreen._turnOffSwipe()
              }
              Animated.timing(
                translateY,
                {
                  toValue: isShow ? 1 : 0,
                  duration: 250
                }
              ).start()
            }}
          />
          <View>
            <Animated.View
              style={{
                overflow: 'hidden',
                opacity: changeOpacityListCoin,
                position: 'absolute',
                top: 2,
                height: 60,
                width: width - 77
              }}
            >
              <Ticker
                data={tickers}
                style={{
                  width: width - 77
                }}
              />
            </Animated.View>
            <Animated.Text
              style={{
                opacity: changeOpacitySetting,
                fontSize: 20,
                color: AppStyle.mainTextColor,
                fontFamily: AppStyle.mainFontBold
              }}
            >
              {constant.SETTING}
            </Animated.Text>
          </View>
        </View>
        <View style={{ height: heightCarousel }}>
          <Carousel
            removeClippedSubviews={false}
            // enableMomentum={false}
            // lockScrollWhileSnapping={Platform.OS === 'android'}
            ref={(c) => { this._carousel = c }}
            data={cards}
            // scrollInterpolator={this.stackScrollInterpolator}
            // slideInterpolatedStyle={this.stackAnimatedStyles}
            layout="default"
            renderItem={this._renderCard}
            sliderWidth={width}
            itemWidth={width - 72}
            inactiveSlideOpacity={1}
            keyExtractor={item => item.address}
            onSnapToItem={(index) => {
              this.sendButton._toggleSendButton(this.checkPrivateKey(cards[index].privateKey))
              if (cards[index].address === '0') {
                WalletStore.setSelectedIndex(null)
              } else {
                WalletStore.setSelectedIndex(index)
                WalletStore.cacheListOriginalWallet()
              }
            }}
          />
        </View>
        <View
          style={{
            marginTop: -20,
            flex: 1,
            alignItems: 'flex-end',
            marginRight: 20
          }}
        >
          {this._renderSendButton(cards)}
        </View>
        <Animated.View
          style={{
            position: 'absolute',
            top: 71 + marginTop,
            width,
            height: height - 71 - marginTop,
            transform: [
              {
                translateY: translateY.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height - 56 + getStatusBarHeight(), Platform.OS === 'ios' ? 0 : getStatusBarHeight()],
                  extrapolate: 'clamp',
                  useNativeDriver: true
                })
              }
            ]
          }}
        >
          <SettingScreen
            ref={(ref) => { this.settingScreen = ref }}
            onDeleted={() => {
              if (WalletStore.selectedIndex === null) {
                this.sendButton._toggleSendButton(false)
              }
            }}
            onCreated={(index, _, isAddress) => {
              this._carousel.snapToItem(index)
              this.sendButton._toggleSendButton(!isAddress)
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: marginTop + 20,
    paddingLeft: 10,
    paddingBottom: 15
  }
})
