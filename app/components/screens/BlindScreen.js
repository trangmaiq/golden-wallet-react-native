import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import AppStyle from '../../commons/AppStyle'

const { width, height } = Dimensions.get('window')

export default class BlindScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }
  render() {
    return (
      <View style={styles.container} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: AppStyle.backgroundColor
  }
})
