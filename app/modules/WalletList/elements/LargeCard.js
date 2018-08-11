import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Clipboard
} from 'react-native'

import { observer } from 'mobx-react/native'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import QRCode from 'react-native-qrcode'
import FlipCard from '../../../../Libs/react-native-flip-card'
import ActionButton from '../../../components/elements/ActionButton'
import SyncBalance from './SyncBalance'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import HapticHandler from '../../../Handler/HapticHandler'
import Helper from '../../../commons/Helper'
import commonStyle from '../../../commons/commonStyles'
import NavStore from '../../../stores/NavStore'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const marginTop = getStatusBarHeight()
const cardWidth = width - 72 - 10
const cardHeight = height - 200 - marginTop - 5

@observer
export default class LargeCard extends Component {
  static propTypes = {
    cardItem: PropTypes.object,
    style: PropTypes.object,
    isNew: PropTypes.bool,
    navigation: PropTypes.object,
    onPress: PropTypes.func,
    onAddPrivateKey: PropTypes.func
  }

  static defaultProps = {
    cardItem: {
      background: 'backgroundBlue',
      cardName: 'Jason Nguyen',
      balance: '0 ETH',
      balanceUSD: '$0',
      address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
    },
    isNew: false,
    style: {},
    navigation: {},
    onPress: () => { },
    onAddPrivateKey: () => { }
  }

  constructor(props) {
    super(props)

    this.state = {
      isFlipped: false
    }
  }

  _handleSecretBalance = debounce((wallet, index) => {
    // WalletStore.editWallet(wallet, index)
  }, 100)

  _getStyleOfView(type) {
    switch (type) {
      case 'Address':
        return styles.addressButtonStyle
      default: // Mnemonic + PrivateKey
        return styles.mnemonicButtonStyle
    }
  }

  _getStyleOfText(type) {
    switch (type) {
      case 'Address':
        return styles.addressTextStyle
      default: // Mnemonic + PrivateKey
        return styles.mnemonicTextStyle
    }
  }

  render() {
    const {
      isNew,
      cardItem,
      style,
      navigation,
      onPress,
      onAddPrivateKey
    } = this.props

    const {
      background,
      cardName,
      // balance,
      // balanceUSD,
      enableSecretBalance,
      address,
      importType,
      balanceValue,
      balanceUSDValue
    } = cardItem
    const isShow = enableSecretBalance === undefined ? true : enableSecretBalance
    const backgroundCard = isNew ? AppStyle.backgroundColor : AppStyle[background]

    const actionButton = (<ActionButton
      buttonItem={{
        name: constant.RECEIVE,
        icon: images.iconQrCode,
        background: '#0A0F24'
      }}
      action={() => {
        this.setState({ isFlipped: !this.state.isFlipped })
      }}
    />)
    const colorBalance = { color: AppStyle.mainColor }
    const colorBalanceUSD = { color: AppStyle.secondaryTextColor }
    const balanceSecret = isShow ? balanceValue : constant.SECRET_WORK
    const balanceUSDSecret = isShow
      ? balanceUSDValue
      : constant.SECRET_WORK

    const copyText = Platform.OS === 'ios'
      ? (
        <View style={styles.backgroundCopy}>
          <Text style={styles.copyButton}>
            {constant.COPY}
          </Text>
        </View>
      )
      : (
        <Text
          style={[
            styles.copyButton, styles.backgroundCopy
          ]}
        >
          {constant.COPY}
        </Text>
      )
    if (isNew) {
      return (
        <TouchableWithoutFeedback
          style={[styles.container]}
          onPress={onPress}
        >
          <View style={[styles.container, { marginTop: 20, margin: 5 }]}>
            <Image
              style={{
                height: cardHeight, width: cardWidth, position: 'absolute', borderRadius: 14
              }}
              source={images.background_add_wallet}
              resizeMode="stretch"
            />
            <Image
              style={{ marginTop: cardHeight * 0.35 }}
              source={images.iconLargeAdd}
            />
            <Text
              style={{
                color: AppStyle.mainColor,
                fontFamily: 'OpenSans-Semibold',
                fontSize: 20,
                marginTop: cardHeight * 0.08
              }}
            >
              Add new wallet
            </Text>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return (
      <FlipCard
        style={{ flex: 1 }}
        friction={6}
        perspective={1000}
        flipHorizontal
        flipVertical={false}
        flip={this.state.isFlipped}
        onFlipStart={() => {
          HapticHandler.ImpactLight()
        }}
      >

        <TouchableWithoutFeedback
          style={[styles.container, { backgroundColor: backgroundCard }, style]}
          onPress={onPress}
        >
          <View style={[styles.container, { backgroundColor: backgroundCard }, style]}>
            <View style={styles.cardHeader}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.cardName}
              >
                {cardName}
              </Text>
              {/* {!WalletStore.isBackup && !importType && */}
              {!importType &&
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BackupScreen')
                  }}
                >
                  <View style={styles.backupField}>
                    <Text style={styles.backupText}>
                      {constant.BACKUP}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
              {importType &&
                <TouchableWithoutFeedback
                  onPress={() => {
                    (importType === 'Address') && onAddPrivateKey()
                  }}
                >
                  <View style={this._getStyleOfView(importType)}>
                    <Text style={this._getStyleOfText(importType)}>
                      {importType === 'Address' ? 'Address Only' : importType}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              }
            </View>
            <Image
              style={[
                styles.imgCard,
                { marginTop: isNew ? cardHeight * 0.2 : cardHeight * 0.07 }
              ]}
              source={images.imgCardETH}
            />
            <Text style={[styles.balance, colorBalance]}>{`${Helper.formatETH(balanceSecret)} ETH`}</Text>
            <Text style={[styles.balanceUSD, colorBalanceUSD, { marginBottom: 6 }]}>{`$${Helper.formatUSD(balanceUSDSecret)}`}</Text>
            <SyncBalance />
            <View style={{ position: 'absolute', bottom: isSmallScreen ? 10 : 20 }}>
              {actionButton}
            </View>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ isFlipped: !this.state.isFlipped })
          }}
        >
          <View style={[styles.container, { backgroundColor: 'white' }, style]}>
            <Image
              style={{
                position: 'absolute',
                top: 0,
                borderRadius: 14,
                width: width - 82,
                height: cardHeight
              }}
              source={images.backgroundGrey}
            />
            <View style={{ marginTop: cardHeight * 0.12 }}>
              <QRCode
                value={address}
                size={isSmallScreen ? cardHeight * 0.36 : 200}
                bgColor="black"
                fgColor="white"
              />
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.cardBackName}
            >
              {cardName}
            </Text>
            <Text style={[styles.cardBackAddress, commonStyle.fontAddress]}>{address}</Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(address)
                NavStore.showToastTop('Copied', {}, { color: AppStyle.mainColor })
              }}
              style={{ marginTop: cardHeight * 0.06 }}
            >
              {copyText}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </FlipCard>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10
  },
  cardHeader: {
    width: cardWidth,
    marginTop: 0.06 * cardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 20,
    justifyContent: 'space-between'
  },
  cardName: {
    fontSize: isSmallScreen ? 14 : 20,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor,
    maxWidth: cardWidth - 145
  },
  backupField: {
    backgroundColor: '#D0021B',
    paddingHorizontal: isSmallScreen ? 14 : 20,
    height: isSmallScreen ? 20 : 30,
    borderRadius: isSmallScreen ? 10 : 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backupText: {
    fontSize: isSmallScreen ? 10 : 14,
    fontFamily: 'OpenSans-Semibold',
    color: 'white'
  },
  imgCard: {
    height: cardHeight * 0.31,
    width: cardHeight * 0.31 * 0.63
  },
  balance: {
    fontSize: isSmallScreen ? 20 : 30,
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    marginTop: isSmallScreen ? cardHeight * 0.02 : 20
  },
  balanceUSD: {
    fontSize: isSmallScreen ? 15 : 24,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: isSmallScreen ? cardHeight * 0.01 : 10
  },
  cardBackName: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#4A4A4A',
    marginTop: cardHeight * 0.04,
    maxWidth: cardWidth - 36
  },
  cardBackAddress: {
    fontSize: 14,
    color: AppStyle.secondaryTextColor,
    marginTop: cardHeight * 0.02,
    paddingHorizontal: 18,
    textAlign: 'center'
  },
  addressButtonStyle: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#0A0F24'
  },
  mnemonicButtonStyle: {
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderColor: '#22273A',
    backgroundColor: 'transparent',
    borderWidth: 1
  },
  addressTextStyle: {
    fontSize: 12,
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  mnemonicTextStyle: {
    fontSize: 12,
    color: AppStyle.secondaryTextColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  copyButton: {
    fontFamily: 'OpenSans-Bold',
    fontSize: isSmallScreen ? 10 : 14,
    color: AppStyle.backgroundColor
  },
  backgroundCopy: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: isSmallScreen ? 15 : 26,
    paddingVertical: isSmallScreen ? 4 : 7,
    borderRadius: 16
  }
})
