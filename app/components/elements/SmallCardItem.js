import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native'
import Proptypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import images from '../../commons/images'

const { width } = Dimensions.get('window')

export default class SmallCardItem extends Component {
  static propTypes = {
    style: Proptypes.object,
    iconStyle: Proptypes.object,
    styleLeft: Proptypes.object,
    nameEther: Proptypes.string,
    numberEther: Proptypes.string,
    dollaEther: Proptypes.string,
    name: Proptypes.string,
    token: Proptypes.string,
    title: Proptypes.string,
    subTitle: Proptypes.string,
    icon: Proptypes.number,
    background: Proptypes.string,
    styleTitle: Proptypes.object,
    subStyle: Proptypes.object,
    styleViewIn: Proptypes.object,
    onPress: Proptypes.func,
    disabled: Proptypes.bool,
    haveShadow: Proptypes.bool,
    imgBackground: Proptypes.string,
    imgBackgroundStyle: Proptypes.object
  }

  static defaultProps = {
    style: null,
    iconStyle: null,
    styleLeft: null,
    nameEther: null,
    numberEther: null,
    dollaEther: null,
    name: null,
    token: null,
    title: null,
    subTitle: null,
    icon: null,
    background: null,
    styleTitle: null,
    subStyle: null,
    styleViewIn: null,
    onPress: () => { },
    disabled: false,
    haveShadow: true,
    imgBackground: null,
    imgBackgroundStyle: {}
  }

  render() {
    const {
      style,
      iconStyle,
      styleLeft,
      nameEther,
      numberEther,
      dollaEther,
      name,
      token,
      title,
      subTitle,
      icon,
      background,
      styleTitle,
      subStyle,
      styleViewIn,
      onPress,
      disabled = false,
      haveShadow = true,
      imgBackground,
      imgBackgroundStyle
    } = this.props

    this.renderIsLeft = () => {
      return (
        <View style={styles.viewLeft}>
          <Image
            source={icon}
            style={iconStyle}
          />
          <View style={[styles.titleLeft, styleLeft]}>
            <Text
              style={styles.nameEther}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {nameEther}
            </Text>
            <Text
              style={[styles.etherNumber, { marginTop: nameEther ? 8 : 0 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`${numberEther} ETH`}
            </Text>
            <Text
              style={styles.dollaEther}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`$${dollaEther}`}
            </Text>
          </View>
        </View>
      )
    }

    this.renderIsRight = () => {
      return (
        <View style={[styles.viewRight, styleLeft]}>
          <View>
            <Text style={[styles.etherNumber, styleTitle, { marginTop: 0, fontSize: 24 }]}>
              {title}
            </Text>
            <Text style={[styles.subTitle, subStyle]}>
              {subTitle}
            </Text>
          </View>
          <Image
            source={icon}
            style={[iconStyle, { marginLeft: 18 }]}
          />
        </View>
      )
    }

    const shadow = haveShadow ? {
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2
    } : {}

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setTimeout(() => onPress(), 100)}
      >
        <View style={[styles.container, { backgroundColor: AppStyle[background] }, shadow, style]}>
          <View style={[styles.viewIn, styleViewIn]}>
            {numberEther !== null ? this.renderIsLeft() : this.renderIsRight()}
            {name && (
              <Text
                style={styles.textName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
            )}
            {token && (
              <Text
                style={styles.textToken}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {token}
              </Text>
            )}
          </View>
          {imgBackground &&
            <Image
              source={images[imgBackground]}
              style={[{ position: 'absolute', top: 0 }, imgBackgroundStyle]}
            />
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 14,
    width: width - 40
  },
  viewIn: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    flex: 1
  },
  viewLeft: {
    flexDirection: 'row',
    marginLeft: 7
  },
  titleLeft: {
    marginLeft: 23,
    justifyContent: 'center'
  },
  viewRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameEther: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 14,
    color: 'white'
  },
  etherNumber: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: 'white'
  },
  dollaEther: {
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16
  },
  textName: {
    marginTop: 19,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: 'white'
  },
  textToken: {
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNew',
    fontSize: 14,
    color: 'white',
    maxWidth: width - 82
  },
  subTitle: {
    marginTop: 10,
    fontSize: 12,
    color: 'rgb(151, 171, 205)',
    maxWidth: width - 185,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular'
  }
})
