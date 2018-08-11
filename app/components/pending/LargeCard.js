import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
// import { getStatusBarHeight } from 'react-native-status-bar-height'
import QRCode from 'react-native-qrcode'
import ActionButton from '../elements/ActionButton'
import images from '../../commons/images'
import constant from '../../commons/constant'
import AppStyle from '../../commons/AppStyle'

const { width } = Dimensions.get('window')
// const statusbarExtra = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const cardWidth = width - 72
const cardHeight = cardWidth * 1.57

export default class LargeCard extends Component {
  static propTypes = {
    cardItem: PropTypes.object,
    type: PropTypes.string,
    style: PropTypes.object,
    isNew: PropTypes.bool
  }

  static defaultProps = {
    type: 'front',
    cardItem: {
      background: 'backgroundBlue',
      cardName: 'Jason Nguyen',
      balance: '0 ETH',
      balanceUSD: '$0',
      address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
    },
    isNew: false,
    style: {}
  }

  render() {
    const {
      isNew,
      type,
      cardItem,
      style
    } = this.props

    const {
      background,
      cardName,
      balance,
      balanceUSD,
      address
    } = cardItem
    const imgBackground = isNew ? images.backgroundWhite : images[background]
    const colorImgIconCard = isNew ? {
      tintColor: AppStyle.backgroundBlue,
      opacity: 0.35
    } : {}
    const actionButton = isNew
      ? (<ActionButton
        style={{
          marginTop: cardHeight * 0.12,
          paddingHorizontal: 25
        }}
        buttonItem={{
          name: constant.ADD_NEW_WALLET,
          icon: images.iconAdd,
          background: 'backgroundWhite'
        }}
        action={() => { }}
        styleText={{ color: AppStyle.backgroundBlue }}
        styleIcon={{ tintColor: AppStyle.backgroundBlue }}
      />)
      : (<ActionButton
        style={{ marginTop: cardHeight * 0.12 }}
        buttonItem={{
          name: constant.RECEIVE,
          icon: images.iconQrCode,
          background
        }}
        action={() => { }}
      />)
    const colorBalance = isNew ? { color: AppStyle.backgroundBlue } : { color: 'white' }

    if (type === 'back') {
      return (
        <View style={[styles.container, { backgroundColor: 'white' }, style]}>
          <Image
            style={{
              position: 'absolute',
              top: 0,
              borderRadius: 14,
              width: cardWidth,
              height: cardHeight
            }}
            source={images.backgroundGrey}
          />
          <View style={{ marginTop: cardHeight * 0.12 }}>
            <QRCode
              value={address}
              size={200}
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
          <Text style={styles.cardBackAddress}>{address}</Text>
          <ActionButton
            style={{
              marginTop: cardHeight * 0.06,
              paddingHorizontal: 27,
              borderWidth: 1,
              borderColor: AppStyle.backgroundBlue,
              height: 32
            }}
            buttonItem={
              {
                name: constant.COPY,
                icon: null,
                background: 'backgroundWhite'
              }
            }
            action={() => { }}
            haveShadow={false}
            styleText={{ color: AppStyle.backgroundBlue }}
          />
        </View>
      )
    }

    return (
      <View style={[styles.container, style]}>
        <Image
          style={{
            position: 'absolute',
            top: 0,
            borderRadius: 14,
            width: cardWidth,
            height: cardHeight
          }}
          source={imgBackground}
        />
        {!isNew &&
          <View style={styles.cardHeader}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.cardName}
            >
              {cardName}
            </Text>
            <TouchableOpacity>
              <View style={styles.backupField}>
                <Text style={styles.backupText}>{constant.BACKUP}</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        <Image
          style={[
            styles.imgCard, colorImgIconCard,
            { marginTop: isNew ? cardHeight * 0.2 : cardHeight * 0.07 }
          ]}
          source={images.imgCardETH}
        />
        <Text style={[styles.balance, colorBalance]}>{balance}</Text>
        <Text style={[styles.balanceUSD, colorBalance]}>{balanceUSD}</Text>
        {actionButton}
      </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4
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
    fontSize: 20,
    fontFamily: 'OpenSans-Semibold',
    color: 'white',
    maxWidth: cardWidth - 145
  },
  backupField: {
    backgroundColor: AppStyle.colorRed,
    width: 90,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  backupText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: 'white'
  },
  imgCard: {
    height: cardHeight * 0.31,
    width: cardHeight * 0.31 * 0.63
  },
  balance: {
    fontSize: 30,
    fontFamily: 'OpenSans-Bold',
    marginTop: cardHeight * 0.04
  },
  balanceUSD: {
    fontSize: 24,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    marginTop: cardHeight * 0.02,
    opacity: 0.8
  },
  cardBackName: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: AppStyle.backgroundBlue,
    marginTop: cardHeight * 0.04,
    maxWidth: cardWidth - 36
  },
  cardBackAddress: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: '#7F8286',
    marginTop: cardHeight * 0.02,
    paddingHorizontal: 18,
    textAlign: 'center'
  }
})
