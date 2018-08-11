import React, { Component } from 'react'
import {
  Platform,
  Keyboard,
  StyleSheet,
  Dimensions,
  Text,
  Easing,
  TouchableOpacity,
  Animated
} from 'react-native'
// import { getStatusBarHeight } from 'react-native-status-bar-height'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'

const { width } = Dimensions.get('window')

const heightOfDoneButton = 40
const originPosition = -heightOfDoneButton

export default class DoneButton extends Component {
  static propTypes = {
    action: PropTypes.func
  }

  static defaultProps = {
    action: () => {}
  }

  state = {
    traslateTop: new Animated.Value(originPosition)
  }

  componentDidMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _runKeyboardAnim(toValue) {
    Animated.timing(this.state.traslateTop, {
      toValue,
      easing: Easing.linear,
      duration: 264
    }).start()
  }

  _keyboardDidShow(e) {
    this._runKeyboardAnim(Number(e.endCoordinates.height) + heightOfDoneButton)
  }

  _keyboardDidHide() {
    this._runKeyboardAnim(originPosition)
  }

  render() {
    const { action } = this.props
    return (
      <Animated.View
        style={[
          styles.container,
          {
            bottom: this.state.traslateTop
          }
        ]}
      >
        <TouchableOpacity
          style={styles.doneStyle}
          onPress={() => {
            action()
          }}
        >
          <Text style={styles.textStyle}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppStyle.backgroundDarkMode,
    position: 'absolute',
    width,
    height: heightOfDoneButton
  },
  doneStyle: {
    alignSelf: 'flex-end',
    marginRight: 2,
    width: 50
  },
  textStyle: {
    fontSize: 16,
    color: 'white',
    fontFamily: AppStyle.mainFontBold
  }
})
