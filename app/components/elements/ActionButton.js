import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import constant from './../../commons/constant'
import images from './../../commons/images'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569

export default class ActionButton extends Component {
  static propTypes = {
    buttonItem: PropTypes.object.isRequired,
    style: PropTypes.object,
    styleText: PropTypes.object,
    styleIcon: PropTypes.object,
    action: PropTypes.func.isRequired,
    haveShadow: PropTypes.bool,
    enable: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    styleIcon: {},
    styleText: {},
    haveShadow: true,
    enable: true
  }
  render() {
    const {
      buttonItem = {
        name: constant.RECEIVE,
        icon: images.iconQrCode,
        background: 'backgroundBlue'
      },
      style,
      styleText,
      styleIcon,
      action,
      haveShadow,
      enable
    } = this.props
    const {
      background,
      icon,
      name,
      imgBackground
    } = buttonItem
    const shadow = haveShadow ? {
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20
    } : {}
    const backgroundColor = imgBackground
      ? {}
      : { backgroundColor: background }
    return (
      <TouchableOpacity
        disabled={!enable}
        onPress={() => action()}
      >
        <View
          style={[
            styles.container,
            backgroundColor,
            shadow,
            style
          ]}
        >
          <Text style={[styles.buttonText, styleText]}>{name}</Text>
          {icon &&
            <Image
              resizeMode="contain"
              style={[styles.buttonIcon, styleIcon]}
              source={icon}
            />
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: isSmallScreen ? 30 : 50,
    borderRadius: isSmallScreen ? 15 : 25,
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 15 : 25,
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: isSmallScreen ? 10 : 14,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  buttonIcon: {
    tintColor: 'white',
    marginLeft: 10,
    height: isSmallScreen ? 15 : 20
  }
})
