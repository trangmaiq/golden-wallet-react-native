import React, { Component } from 'react'
import { View } from 'react-native'
import AppScreen from './navigation/AppScreen'

export default class MainStack extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppScreen.HomeScreen />
      </View>
    )
  }
}
