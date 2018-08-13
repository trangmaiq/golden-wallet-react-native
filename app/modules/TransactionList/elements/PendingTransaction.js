import React, { Component } from 'react'
import {
  Animated,
  Easing
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'

export default class PendingTransaction extends Component {
  static propTypes = {
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  state = {
    rotate_value: new Animated.Value(0)
  }

  componentDidMount() {
    this._startAnimation()
  }

  _startAnimation = () => {
    Animated.loop(Animated.timing(this.state.rotate_value, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    })).start()
  }

  render() {
    const {
      style
    } = this.props
    return (
      <Animated.Image
        style={[{
          transform: [
            {
              rotate: this.state.rotate_value.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '720deg']
              })
            }
          ]
        }, style]}
        source={images.iconPending}
      />
    )
  }
}
