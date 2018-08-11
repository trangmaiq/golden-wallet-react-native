import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Animated
} from 'react-native'
import PropTypes from 'prop-types'
import FCM from 'react-native-fcm'
import Carousel, { getInputRangeFromIndexes } from 'react-native-snap-carousel'
import { observer } from 'mobx-react/native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import LargeCard from '../elements/LargeCard'
import Hamburger from '../elements/HamburgerButton'
import SettingScreen from './SettingScreen'
import HomeSendButton from '../elements/HomeSendButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import NotificationListenter from '../../../NotificationListener'
import NotificationStore from '../../../stores/NotificationStore'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const heightCarousel = height - 200 - marginTop + 60

@observer
export default class HomeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    NotificationListenter.registerAppListener(this.props.navigation)
    FCM.setBadgeNumber(0)
    this.state = {
      translateY: new Animated.Value(0)
    }
  }

  componentDidMount() {
    // setTimeout(() => {
    //   TickerStore.callApi()
    // }, 0)
    this.index = 0
    this.shouldShowSuccess = true
    setTimeout(() => {
      if (!NotificationStore.isInitFromNotification) {
        this.props.navigation.navigate('UnlockScreen', {
          isLaunchApp: true,
          onUnlock: () => {
            this._gotoCreateWallet()
          }
        })
      } else {
        this.props.navigation.navigate('TransactionDetailScreen', NotificationStore.transactionFromNotif)
      }
    }, 100)
  }

  _shouldShowSendButton(cards) {
    if (cards.length === 0) {
      return false
    }
    return cards[0].privateKey !== undefined && cards[0].privateKey !== ''
  }

  returnData = (isCreateSuccess, index, isCreate = false, isAddress = false) => {
    if (isCreateSuccess) {
      // WalletStore.setSelectedIndex(index)
      // WalletStore.cacheListOriginalWallet()
      // const wallet = WalletStore.dataCards[index]
      // this.sendButton._toggleSendButton(isCreateSuccess && !isAddress)
      // setTimeout(() => {
      //   if (isCreate) {
      //     // TokenStore.initDataWalletWhenCreate(wallet.address)
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

  _renderSendButton = (cards) => {
    return (
      <HomeSendButton
        ref={(ref) => { this.sendButton = ref }}
        isShow={this._shouldShowSendButton(cards)}
        action={() => {
          // if (WalletStore.selectedWallet) {
          //   if (WalletStore.selectedWallet.canSendTransaction()) {
          //     // NavStore.openModal()
          //     this.props.navigation.navigate('SendTransactionStack')
          //     const wl = WalletStore.selectedWallet
          //     const wallet = {
          //       postfix: 'ETH',
          //       balanceCrypto: WalletStore.selectedWallet.balanceETH || 0,
          //       balanceUSD: WalletStore.selectedWallet.balanceETH * CurrencyStore.currencyUSD || 0,
          //       ratio: CurrencyStore.currencyUSD
          //     }
          //     sendTransactionStore.setWallet(wallet)
          //     sendTransactionStore.selectedToken = { title: 'ETH', address: wl.address }
          //   } else {
          //     NavStore.popupCustom.show('This wallet can not send a transaction')
          //   }
          // } else {
          //   NavStore.popupCustom.show('You have no wallet selected')
          // }
        }}
      />
    )
  }

  _gotoCreateWallet() {
    this.props.navigation.navigate('CreateWalletStack', {
      returnData: this.returnData,
      // index: WalletStore.dataCards.length
      index: 0
    })
  }

  _renderCard = ({ item, index }) => {
    return (
      <LargeCard
        // isNew={index === WalletStore.dataCards.length}
        isNew={index === 0}
        cardItem={item}
        index={index}
        style={{ margin: 5, marginTop: 20 }}
        navigation={this.props.navigation}
        onPress={() => {
          // index !== WalletStore.dataCards.length
          index !== 0
            ? this.props.navigation.navigate('TokenScreen', {
              currentIndex: index,
              card: item
            })
            : this._gotoCreateWallet()
        }}
        onAddPrivateKey={() => {
          this.props.navigation.navigate('AddPrivateKeyScreen', {
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
    const { navigation } = this.props
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
    // let cards = WalletStore.dataCards.slice()
    let cards = []
    if (cards.length < 5) {
      cards = [{
        balance: '0 ETH',
        balanceUSD: '$0',
        address: '0'
      }, ...cards]
    }
    // const tickers = TickerStore.tickers.slice()

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
              {/* <Ticker
                data={tickers}
                style={{
                  width: width - 77
                }}
              /> */}
            </Animated.View>
            <Animated.Text
              style={{
                opacity: changeOpacitySetting,
                fontSize: 20,
                color: AppStyle.mainTextColor,
                fontFamily: 'OpenSans-Bold'
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
              // this.sendButton._toggleSendButton(this.checkPrivateKey(cards[index].privateKey))
              // if (cards[index].address === '0') {
              //   WalletStore.setSelectedIndex(null)
              // } else {
              //   WalletStore.setSelectedIndex(index)
              //   WalletStore.cacheListOriginalWallet()
              // }
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
              // if (WalletStore.selectedIndex === null) {
              //   this.sendButton._toggleSendButton(false)
              // }
            }}
            navigation={navigation}
            onCreated={(index, isCreate, isAddress) => {
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
