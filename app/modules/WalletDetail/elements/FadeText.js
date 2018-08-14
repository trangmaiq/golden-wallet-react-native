import React, { Component } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import constant from '../../../commons/constant'

export default class FadeText extends Component {
  static propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    isShow: PropTypes.bool,
    securityText: PropTypes.string
  }

  static defaultProps = {
    text: '',
    style: {},
    textStyle: {},
    isShow: true,
    securityText: constant.SECRET_WORK
  }
  constructor(props) {
    super(props)
    this.state = {
      opacity2: new Animated.Value(props.isShow ? 1 : 0),
      opacity1: new Animated.Value(props.isShow ? 0 : 1)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isUpdate = (this.props.isShow !== nextProps.isShow) || (this.props.text !== nextProps.text)
    return isUpdate
  }

  componentDidUpdate() {
    this.toogleAnim()
  }

  toogleAnim = () => {
    const { isShow } = this.props
    const { opacity1, opacity2 } = this.state

    Animated.sequence([
      Animated.timing(isShow ? opacity1 : opacity2, {
        toValue: 0,
        duration: 125
      }),
      Animated.timing(isShow ? opacity2 : opacity1, {
        toValue: 1,
        duration: 125
      })
    ]).start()
  }

  render() {
    const { opacity2, opacity1 } = this.state
    const {
      text,
      style,
      textStyle,
      securityText
    } = this.props

    return (
      <View>
        <View
          style={[styles.container, style]}
        >
          {text !== null &&
            <Animated.Text
              style={[styles.text, textStyle, { opacity: opacity1 }]}
            >
              {text}
            </Animated.Text>}
        </View>
        <View
          style={[styles.container, style, { position: 'absolute' }]}
        >
          {text !== null &&
            <Animated.Text
              style={[styles.text, textStyle, { opacity: opacity2 }]}
            >
              {securityText}
            </Animated.Text>}
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  text: {
    fontSize: 16,
    color: 'white'
  }
})
