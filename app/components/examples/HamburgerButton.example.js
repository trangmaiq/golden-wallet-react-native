import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import Hamburger from './../elements/HamburgerButton'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0

export default class HamburgerButtonExam extends Component {
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
        <Hamburger
          onPressHamburger={(isShow) => { }}
        />
      </View>
    )
  }
}
