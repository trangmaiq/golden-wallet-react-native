import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Clipboard,
  Image,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import QRCode from 'react-native-qrcode'
import NavigationHeader from './../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import ActionButton from '../elements/ActionButton'
import LayoutUtils from '../../commons/LayoutUtils'
import commonStyle from '../../commons/commonStyles'
import NavStore from '../../stores/NavStore'

const { width, height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()
const isSmallScreen = height < 569
const cardWidth = width - 72
const cardHeight = height - 200 - marginTop

export default class ReceiveScreen extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }

  static defaultProps = {
    onClose: () => { }
  }

  render() {
    const {
      onClose,
      address,
      name
    } = this.props

    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ width }}
          headerItem={{
            title: constant.RECEIVE,
            icon: null,
            button: images.closeButton
          }}
          action={onClose}
        />
        {/* <View
          style={{
            marginTop: popupHeight * 0.14,
            paddingHorizontal: 50,
            alignItems: 'center'
          }}
        >
          <QRCode
            value={address}
            size={200}
            bgColor="black"
            fgColor="white"
          />
          <Text style={styles.name}>{name}</Text>
          <Text
            numberOfLines={2}
            style={[styles.address, fontWeight]}
          >
            {address}
          </Text>
          <ActionButton
            style={{
              height: 32,
              marginTop: 40
            }}
            buttonItem={{
              name: constant.COPY,
              icon: null,
              background: 'backgroundWhite'
            }}
            action={() => {
              Clipboard.setString(address)
              Toast.showShortTop(`Copied`)
            }}
            styleText={{ color: AppStyle.backgroundBlue }}
            styleIcon={{ tintColor: AppStyle.backgroundBlue }}
          />
        </View> */}
        <View style={[styles.cardStyle, { backgroundColor: 'white' }]}>
          <Image
            style={{
              position: 'absolute',
              top: 0,
              borderRadius: 14,
              width: width - 72,
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
            style={styles.name}
          >
            {name}
          </Text>
          <Text style={[styles.address, commonStyle.fontAddress]}>{address}</Text>
          <ActionButton
            haveShadow={false}
            style={{
              marginTop: cardHeight * 0.06,
              height: isSmallScreen ? 22 : 32
            }}
            buttonItem={
              {
                name: constant.COPY,
                icon: null,
                background: '#E5E5E5'
              }
            }
            action={() => {
              Clipboard.setString(address)
              NavStore.showToastTop('Copied', {}, { color: AppStyle.mainColor })
            }}
            styleText={{ color: AppStyle.backgroundColor }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 26,
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundColor
  },
  cardStyle: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 30
  },
  name: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    marginTop: cardHeight * 0.04,
    color: '#4A4A4A'
  },
  address: {
    color: AppStyle.secondaryTextColor,
    fontSize: 14,
    marginTop: cardHeight * 0.04,
    textAlign: 'center',
    paddingHorizontal: 18
  }
})
