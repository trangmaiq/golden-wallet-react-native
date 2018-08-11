import React, { Component } from 'react'
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'

export default class HamburgerButton extends Component {
  static propTypes = {
    style: PropTypes.object,
    onPressHamburger: PropTypes.func.isRequired
  }

  static defaultProps = {
    style: {}
  }

  state = {
    spinValue: new Animated.Value(0),
    translateValue: new Animated.Value(0)
  }

  isMenu = true

  rotate(value) {
    return this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${value}deg`],
      useNativeDriver: true
    })
  }

  translateY(value) {
    return this.state.translateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, value],
      useNativeDriver: true
    })
  }

  translateX(value) {
    return this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, value]
    })
  }

  changeOpacity(value) {
    return this.state.translateValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, value]
    })
  }

  togglePress() {
    this.props.onPressHamburger(this.isMenu)
    if (this.isMenu) {
      Animated.sequence([
        // decay, then spring to start and twirl
        Animated.timing(
          this.state.translateValue,
          {
            toValue: this.isMenu ? 1 : 0,
            duration: 125
          }
        ),
        Animated.spring(
          this.state.spinValue,
          {
            toValue: this.isMenu ? 1 : 0,
            duration: 125,
            tension: 40,
            friction: 4
          }
        )
      ]).start()
    } else {
      Animated.parallel([
        // decay, then spring to start and twirl
        Animated.spring(
          this.state.spinValue,
          {
            toValue: this.isMenu ? 1 : 0,
            duration: 125
          }
        ),
        Animated.timing(
          this.state.translateValue,
          {
            toValue: this.isMenu ? 1 : 0,
            duration: 250
          }
        )
      ]).start()
    }
    this.isMenu = !this.isMenu
  }

  render() {
    const {
      style
    } = this.props

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.togglePress()
        }}
      >
        <Animated.View style={[styles.container, style]}>
          <Animated.Image
            style={{
              tintColor: AppStyle.mainColor,
              transform: [
                {
                  rotate: this.rotate(45)
                },
                {
                  translateY: this.translateY(9)
                },
                {
                  translateX: this.translateX(3.5)
                }
              ]
            }}
            source={images.line1}
          />
          <Animated.Image
            style={{
              tintColor: AppStyle.mainColor,
              marginTop: 5,
              opacity: this.changeOpacity(0)
            }}
            source={images.line2}
          />
          <Animated.Image
            style={{
              tintColor: AppStyle.mainColor,
              marginTop: 5,
              transform: [
                {
                  rotate: this.rotate(-45)
                },
                {
                  translateY: this.translateY(-9)
                },
                {
                  translateX: this.translateX(3.5)
                }
              ]
            }}
            source={images.line1}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  }
})
