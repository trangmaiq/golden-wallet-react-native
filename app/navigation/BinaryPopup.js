import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Animated
} from 'react-native'
import PropsType from 'prop-types'
import AppStyle from '../commons/AppStyle'
import LayoutUtils from '../commons/LayoutUtils'

const { width } = Dimensions.get('window')
const widthOfPopup = width * 0.7
const heightOfButton = 44

const Types = {
  normal: 'normal',
  input: 'input'
}
const marginTop = LayoutUtils.getExtraTop()
export default class BinaryPopup extends Component {
  static propTypes = {
    title: PropsType.string,
    content: PropsType.string,
    firstAction: PropsType.object,
    secondAction: PropsType.object,
    type: PropsType.string
  }

  static defaultProps = {
    title: ' ',
    content: '',
    firstAction: {},
    secondAction: {},
    type: Types.normal
  }

  state = {
    extraHeight: new Animated.Value(0),
    text: ''
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _runExtraHeight(toValue) {
    Animated.timing(
      this.state.extraHeight,
      {
        toValue: -toValue,
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    if (e.endCoordinates.screenY < 437 + marginTop) {
      this._runExtraHeight(437 + marginTop - e.endCoordinates.screenY)
    }
  }

  _keyboardDidHide(e) {
    this._runExtraHeight(0)
  }

  _renderContentText = () => {
    const { content } = this.props
    if (content !== '') {
      return (
        <Text style={[styles.title, { marginTop: 12, fontSize: 14 }]}>{content}</Text>
      )
    }
    return null
  }

  _renderTextInput = () => {
    const { type } = this.props
    if (type === Types.normal) {
      return null
    }
    return (
      <TextInput
        autoFocus
        autoCorrect={false}
        style={styles.textInput}
        underlineColorAndroid="transparent"
        onChangeText={(text) => {
          this.setState({ text })
        }}
        keyboardAppearance="dark"
        placeholder="Wallet Name"
        placeholderTextColor="#4A4A4A"
        value={this.state.text}
      />
    )
  }

  render() {
    const {
      title,
      firstAction,
      secondAction,
      content,
      type
    } = this.props
    const { text } = this.state
    const haveContent = content !== ''
    const isInput = type === Types.input

    return (
      <Animated.View style={[styles.container, {
        transform: [
          { translateY: this.state.extraHeight }
        ]
      }]}
      >
        <View style={{ backgroundColor: AppStyle.Color.background, borderRadius: 14 }}>
          <View style={{ padding: 16 }}>
            <Text
              style={[styles.title, {
                color: (haveContent && isInput) ? AppStyle.mainColor : 'white',
                fontFamily: haveContent ? AppStyle.mainFontSemiBold : AppStyle.mainFont,
                fontSize: haveContent ? 20 : 16
              }]}
            >{title}
            </Text>
            {this._renderContentText()}
          </View>
          {this._renderTextInput()}
          <View style={styles.line} />
          <View style={styles.button}>
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback
                style={{ flex: 1, backgroundColor: 'red' }}
                onPress={() => {
                  firstAction.action()
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[
                    styles.title,
                    {
                      color: AppStyle.mainColor,
                      fontFamily: AppStyle.mainFontSemiBold
                    }]}
                  >
                    {firstAction.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.verticalLine} />
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback
                style={{ flex: 1, backgroundColor: 'red' }}
                onPress={() => {
                  secondAction.action(text)
                }}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[
                    styles.title,
                    {
                      color: AppStyle.mainColor,
                      fontFamily: AppStyle.mainFontBold
                    }]}
                  >
                    {secondAction.title}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: widthOfPopup,
    justifyContent: 'center'
  },
  title: {
    fontFamily: AppStyle.mainFont,
    color: AppStyle.Color.gray,
    fontSize: 16,
    textAlign: AppStyle.Align.center
  },
  button: {
    height: heightOfButton,
    flexDirection: 'row'
  },
  line: {
    marginTop: 10,
    height: 1,
    width: widthOfPopup,
    backgroundColor: AppStyle.Color.lineColor
  },
  verticalLine: {
    height: heightOfButton,
    width: 1,
    backgroundColor: AppStyle.Color.lineColor
  },
  textInput: {
    borderRadius: 5,
    marginHorizontal: 16,
    padding: 10,
    color: AppStyle.mainTextColor,
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    backgroundColor: AppStyle.backgroundDarkBlue
  }
})
