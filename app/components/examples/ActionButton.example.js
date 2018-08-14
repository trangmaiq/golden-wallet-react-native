import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ActionButton from './../elements/ActionButton'
import constant from './../../commons/constant'
import images from './../../commons/images'
import AppStyle from '../../commons/AppStyle'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    name: constant.RECEIVE,
    icon: images.iconQrCode,
    background: 'backgroundBlue'
  },
  {
    name: constant.RECEIVE,
    icon: images.iconQrCode,
    background: 'backgroundOrange'
  },
  {
    name: constant.SEND,
    icon: images.iconSend,
    background: 'backgroundWhite'
  },
  {
    name: constant.ADD_NEW_WALLET,
    icon: images.iconAdd,
    background: 'backgroundWhite'
  },
  {
    name: constant.SCAN_QR_CODE,
    icon: images.iconQrCode,
    background: 'backgroundWhite'
  },
  {
    name: constant.COPY,
    icon: null,
    background: 'backgroundWhite'
  }
]

export default class ActionButtonExam extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }
  componentDidMount() {
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: marginTop + 20
        }}
      >
        <ActionButton
          buttonItem={data[0]}
          action={() => { }}
        />
        <ActionButton
          style={{
            marginTop: 20
          }}
          buttonItem={data[1]}
          action={() => { }}
        />
        <ActionButton
          style={{
            marginTop: 20
          }}
          buttonItem={data[2]}
          action={() => { }}
          styleText={{ color: AppStyle.backgroundBlue }}
          styleIcon={{ tintColor: AppStyle.backgroundBlue }}
        />
        <ActionButton
          style={{
            marginTop: 20,
            paddingHorizontal: 25
          }}
          buttonItem={data[3]}
          action={() => { }}
          styleText={{ color: AppStyle.backgroundBlue }}
          styleIcon={{ tintColor: AppStyle.backgroundBlue }}
        />
        <ActionButton
          style={{
            marginTop: 20,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: AppStyle.backgroundBlue,
            height: 34
          }}
          buttonItem={data[4]}
          action={() => { }}
          haveShadow={false}
          styleText={{ color: AppStyle.backgroundBlue }}
          styleIcon={{ tintColor: AppStyle.backgroundBlue }}
        />
        <ActionButton
          style={{
            marginTop: 20,
            paddingHorizontal: 27,
            borderWidth: 1,
            borderColor: AppStyle.backgroundBlue,
            height: 32
          }}
          buttonItem={data[5]}
          action={() => { }}
          haveShadow={false}
          styleText={{ color: AppStyle.backgroundBlue }}
        />
      </View>
    )
  }
}
