import React, { Component } from 'react'
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import LayoutUtils from '../../commons/LayoutUtils'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'

const { height } = Dimensions.get('window')
const isIPX = height === 812
const extraBottom = LayoutUtils.getExtraBottom()

export default class BottomButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string,
    enable: PropTypes.bool
  }

  static defaultProps = {
    text: constant.DONE,
    enable: true
  }

  state = {
    bottom: new Animated.Value(20 + extraBottom),
    marginVertical: new Animated.Value(20),
    borderRadius: new Animated.Value(5)
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
    Animated.parallel([
      Animated.timing(
        this.state.bottom,
        {
          toValue,
          duration: 250
        }
      ),
      Animated.timing(
        this.state.marginVertical,
        {
          toValue: toValue === 20 + extraBottom ? 20 : 0,
          duration: 250
        }
      ),
      Animated.timing(
        this.state.borderRadius,
        {
          toValue: toValue === 20 + extraBottom ? 5 : 0,
          duration: 250
        }
      )
    ]).start()
  }

  _keyboardDidShow(e) {
    let value = e.endCoordinates.height + extraBottom

    if (Platform.OS == 'android') {
      value = 0
    }
    this._runKeyboardAnim(value)
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(20 + extraBottom)
  }

  render() {
    const { onPress, text, enable } = this.props
    return (
      <Animated.View style={{
        position: 'absolute',
        bottom: this.state.bottom,
        marginTop: 10,
        borderRadius: this.state.borderRadius,
        backgroundColor: '#121734',
        left: this.state.marginVertical,
        right: this.state.marginVertical
      }}
      >
        <TouchableOpacity
          disabled={!enable}
          onPress={() => {
            Keyboard.dismiss()
            onPress()
          }}
          style={styles.saveButton}
        >
          <Text style={{ fontSize: 16, color: enable ? AppStyle.mainColor : AppStyle.Color.silverColor, fontFamily: AppStyle.mainFontSemiBold }}>
            {text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  saveButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
