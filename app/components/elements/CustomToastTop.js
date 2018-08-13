import React, { Component } from 'react'
import {
  Animated,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native'
// import PropTypes from 'prop-types'
import HapticHandler from '../../Handler/HapticHandler'

const { width } = Dimensions.get('window')

export default class CreateWalletScreen extends Component {
  state = {
    offsetToast: new Animated.Value(-100),
    content: '',
    styleText: {},
    style: {}
  }

  showToast(content, style = {}, styleText = {}) {
    this.setState({
      content,
      style,
      styleText
    })
    setTimeout(() => HapticHandler.ImpactLight(), 100)
    Animated.timing(this.state.offsetToast, {
      toValue: 0,
      duration: 250
    }).start()
    setTimeout(() => this.hideToast(), 1000)
  }

  hideToast() {
    Animated.timing(this.state.offsetToast, {
      toValue: -100,
      duration: 250
    }).start()
  }

  render() {
    const { content, style, styleText } = this.state
    return (
      <Animated.View
        style={[styles.container, {
          transform: [
            {
              translateY: this.state.offsetToast
            }
          ]
        }, style]}
      >
        <Text style={[styles.copyText, styleText]}>{content}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 100,
    backgroundColor: '#212637',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute'
  },
  copyText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#4A90E2',
    marginBottom: 10
  }
})
