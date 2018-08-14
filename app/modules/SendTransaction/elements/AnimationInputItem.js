import React, { Component } from 'react'
import { Animated, Text, Dimensions, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
export default class AnimationInputItem extends Component {
  static propTypes = {
    animated: PropTypes.bool,
    text: PropTypes.string,
    sub: PropTypes.bool,
    sizeSmall: PropTypes.bool
  }

  static defaultProps = {
    animated: false,
    text: '',
    sub: false,
    sizeSmall: false
  }

  constructor(props) {
    super(props)
    this.state = {
      translateY: new Animated.Value(-15),
      opacity: new Animated.Value(0)
    }
  }

  componentDidMount() {
    (this.props.animated) &&
      this.addAnimation()
  }

  componentWillReceiveProps(nextProps) {
    this.addAnimation()
  }

  addAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: 0,
          duration: 200
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: 200
        }
      )
    ]).start()
  }

  removeAnimation() {
    Animated.parallel([
      Animated.timing(
        this.state.translateY,
        {
          toValue: -15,
          duration: 200
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: 200
        }
      )
    ]).start()
  }

  render() {
    const { translateY, opacity } = this.state
    const { text, sub, sizeSmall } = this.props
    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY
              }
            ],
            opacity
          }
        ]}
      >
        <Text style={[styles.inputStyle, { color: sub ? AppStyle.greyTextInput : 'white', fontSize: sizeSmall ? 40 : 60 }]}>{text}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    fontFamily: 'OpenSans-Semibold'
  }
})
