import React, { Component } from 'react'
import {
  StyleSheet
} from 'react-native'
import RNGoldenLoading from '../../../../Libs/rn-golden-loading'
import images from '../../../commons/images'

const circleSize = 120

export default class GoldenLoading extends Component {

  stop() {
  }

  startAnimation() {
  }

  render() {
    return (
      <RNGoldenLoading style={[styles.styleCircle, this.props.style]} image={{ uri: 'logo_loading' }} />
    )
  }
}

const styles = StyleSheet.create({
  styleCircle: {
    width: circleSize,
    height: circleSize
  }
})
