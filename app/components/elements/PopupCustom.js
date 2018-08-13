import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Keyboard,
  Animated
} from 'react-native'
// import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'

export default class PopupCustom extends Component {
  state = {
    visible: false,
    title: 'Alert',
    content: null,
    buttons: [
      {
        text: 'OK',
        onClick: () => {
          this.setState({
            visible: false
          })
        }
      }
    ],
    valueInput: '',
    type: 'normal',
    isAddress: false,
    offsetY: new Animated.Value(0)
  }

  componentWillMount() {
    const show = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    this.keyboardDidShowListener = Keyboard.addListener(show, e => this._keyboardDidShow(e))
    this.keyboardDidHideListener = Keyboard.addListener(hide, e => this._keyboardDidHide(e))
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  _runKeyboardAnim(toValue) {
    // if (!isNaN(this.state.bottom)) return

    // this.setState({bottom: toValue})
    Animated.timing(
      // Animate value over time
      this.state.offsetY, // The value to drive
      {
        toValue: -toValue, // Animate to final value of 1
        duration: 250,
        useNativeDriver: true
      }
    ).start()
  }

  _keyboardDidShow(e) {
    const value = Platform.OS === 'ios' ? e.endCoordinates.height / 2 : 0
    this._runKeyboardAnim(value)
  }

  _keyboardDidHide(e) {
    this._runKeyboardAnim(0)
  }

  show(title = this.state.title, buttons = [
    {
      text: 'OK',
      onClick: () => {
        this.setState({
          visible: false
        })
      }
    }
  ], content, type = 'normal', isAddress = false, valueInput = '') {
    this.setState({
      visible: true,
      content,
      buttons,
      title,
      type,
      isAddress,
      valueInput
    })
  }

  hide() {
    this.setState({
      visible: false
    })
  }

  _renderButons = () => {
    const { buttons, valueInput } = this.state
    const buttonsView = buttons.map((btn, index) => {
      const lineBetween = index > 0
        ? <View style={styles.line} />
        : <View />
      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
          }}
        >
          {lineBetween}
          <TouchableOpacity
            style={[styles.buttonView]}
            onPress={() => { btn.onClick(valueInput) }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.textButton}>{btn.text}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    })
    return buttonsView
  }

  render() {
    const {
      visible, title, content, type, valueInput, isAddress
    } = this.state
    const contentPaddingVertical = type === 'input'
      ? {
        paddingTop: 18,
        paddingBottom: 12
      }
      : {
        paddingVertical: 26
      }
    const titleColor = type === 'input'
      ? { color: AppStyle.mainColor }
      : { color: AppStyle.mainTextColor }
    const contentMarginTop = type === 'input'
      ? { marginTop: 8 }
      : { marginTop: 20 }
    let fontAddress = {}
    if (isAddress) {
      fontAddress = Platform.OS === 'ios'
        ? { fontFamily: 'Courier New', fontWeight: 'bold' }
        : { fontFamily: 'CourierNewBold' }
    }
    const renderContent = type === 'input'
      ? (
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={[styles.contentPopup, contentMarginTop, fontAddress]}
        >
          {content}
        </Text>
      )
      : <Text style={[styles.contentPopup, contentMarginTop, fontAddress]}>{content}</Text>
    return (
      <Modal
        animationType="none"
        transparent
        visible={visible}
        onRequestClose={() => { }}
      >
        <Animated.View
          style={[styles.overlayPopup, {
            transform: [
              {
                translateY: this.state.offsetY
              }
            ]
          }]}
        >
          <View style={styles.popupCustom}>
            <View style={[styles.contentField, contentPaddingVertical]}>
              <Text style={[styles.titlePopup, titleColor]}>{title}</Text>
              {content &&
                renderContent
              }
              {type === 'input' &&
                <TextInput
                  autoFocus
                  autoCorrect={false}
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => {
                    this.setState({ valueInput: text })
                  }}
                  keyboardAppearance="dark"
                  placeholder="Wallet Name"
                  placeholderTextColor="#4A4A4A"
                  value={valueInput}
                />
              }
            </View>
            <View style={styles.buttonField}>
              {this._renderButons()}
            </View>
          </View>
        </Animated.View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  popupCustom: {
    width: 270,
    borderRadius: 14,
    backgroundColor: '#0A0F24'
  },
  overlayPopup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)'
  },
  titlePopup: {
    fontSize: 17,
    fontFamily: 'OpenSans-Semibold',
    textAlign: 'center'
  },
  buttonField: {
    borderTopWidth: 0.5,
    borderColor: '#14192D',
    flexDirection: 'row',
    alignItems: 'center',
    height: 43
  },
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textButton: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainColor
  },
  contentField: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17
  },
  line: {
    height: 43,
    width: 0.5,
    backgroundColor: '#14192D'
  },
  contentPopup: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.mainTextColor,
    textAlign: 'center'
  },
  textInput: {
    width: 236,
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: AppStyle.mainTextColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    backgroundColor: '#121734'
  }
})
