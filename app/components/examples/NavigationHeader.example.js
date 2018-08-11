import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    title: constant.TRANSACTIONS,
    icon: null,
    button: images.backButton
  },
  {
    title: null,
    icon: null,
    button: images.backButton
  },
  {
    title: constant.TOKEN,
    icon: null,
    button: images.closeButton
  },
  {
    title: constant.ETHEREUM,
    icon: images.iconETH,
    button: images.backButton
  }
]

export default class NavigationHeaderExam extends Component {
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
          marginTop: marginTop + 20
        }}
      >
        <NavigationHeader
          headerItem={data[0]}
          action={() => { }}
        />
        <NavigationHeader
          style={{ marginTop: 20 }}
          headerItem={data[1]}
          action={() => { }}
        />
        <NavigationHeader
          style={{ marginTop: 20 }}
          headerItem={data[2]}
          action={() => { }}
        />
        <NavigationHeader
          style={{ marginTop: 20 }}
          headerItem={data[3]}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Semibold',
            color: AppStyle.backgroundBlack
          }}
          action={() => { }}
        />
      </View>
    )
  }
}
