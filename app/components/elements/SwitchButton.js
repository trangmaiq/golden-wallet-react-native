import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import HapticHandler from '../../Handler/HapticHandler'

export default class SwitchButton extends Component {
  static propTypes = {
    onStateChange: PropTypes.func,
    enable: PropTypes.bool
  }

  static defaultProps = {
    onStateChange: () => { },
    enable: false
  }

  state = {
    translateShape: new Animated.Value(0)
  }

  _startAnimated(value) {
    const { translateShape } = this.state
    Animated.timing(translateShape, {
      toValue: value,
      duration: 250
    }).start()
  }

  _turnOn() {
    this._startAnimated(1)
  }

  _turnOff() {
    this._startAnimated(0)
  }

  render() {
    const { onStateChange, enable } = this.props
    if (enable) {
      this._turnOn()
    }
    const animationTranslate = this.state.translateShape.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
      useNativeDriver: true
    })
    const backgroundColor = enable
      ? { backgroundColor: AppStyle.mainColor }
      : { backgroundColor: AppStyle.mainTextColor }
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            HapticHandler.ImpactLight()
            onStateChange(!enable)
            !enable ? this._turnOn() : this._turnOff()
          }}
        >
          <View style={styles.container}>
            <View
              style={[styles.shape1, backgroundColor]}
            />
            <Animated.View
              style={[styles.shape2, backgroundColor, {
                transform: [
                  {
                    translateX: animationTranslate
                  }
                ]
              }]}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  shape1: {
    width: 30,
    height: 10,
    borderRadius: 5
  },
  shape2: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  }
})
