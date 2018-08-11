import React, { Component } from 'react'
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import PropsTypes from 'prop-types'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'

export default class SearchInput extends Component {
  static propTypes = {
    placeholder: PropsTypes.string,
    style: PropsTypes.object,
    value: PropsTypes.string,
    onPress1: PropsTypes.func,
    onPress2: PropsTypes.func,
    action: PropsTypes.string,
    onChangeText: PropsTypes.func,
    isETH: PropsTypes.bool,
    keyboardType: PropsTypes.string,
    isShowDownButton: PropsTypes.bool,
    onDownButtonPress: PropsTypes.func,
    autoFocus: PropsTypes.bool,
    onFocus: PropsTypes.func,
    needPasteButton: PropsTypes.bool,
    styleTextInput: PropsTypes.number,
    delayFocus: PropsTypes.number
  }

  static defaultProps = {
    placeholder: null,
    style: null,
    value: null,
    onPress1: null,
    onPress2: null,
    action: null,
    onChangeText: () => { },
    isETH: true,
    keyboardType: 'default',
    isShowDownButton: false,
    onDownButtonPress: () => { },
    autoFocus: false,
    onFocus: () => { },
    needPasteButton: false,
    styleTextInput: 0,
    delayFocus: 0
  }

  componentDidMount() {
    const { delayFocus } = this.props
    if (delayFocus > 0) {
      setTimeout(() => {
        this.textInput.focus()
      }, delayFocus)
    }
  }

  onChangeText = (text) => {
    const { onChangeText = () => { } } = this.props
    onChangeText(text)
  }

  clearText = () => {
    const { onChangeText = () => { } } = this.props
    onChangeText('')
  }

  focus() {
    this.textInput.focus()
  }

  render() {
    const {
      placeholder = '',
      style = {},
      onPress1 = () => { },
      onPress2 = () => { },
      action,
      value,
      isETH,
      keyboardType,
      isShowDownButton = false,
      onDownButtonPress,
      autoFocus,
      onFocus,
      onChangeText,
      needPasteButton,
      styleTextInput
    } = this.props
    // const { text } = this.state

    this.renderButtonAmout = () => {
      return (
        <TouchableOpacity
          style={styles.buttonBlue}
          onPress={() => onPress2()}
        >
          <Text style={[styles.textButton, { color: AppStyle.textColorEther }]}>
            {isETH ? 'ETH' : 'USD'}
          </Text>
        </TouchableOpacity>
      )
    }

    this.renderTextButton = () => {
      if (value !== '') {
        return this.renderIconClear()
      }
      return (
        <TouchableOpacity
          style={{ marginRight: (action === 'Max' ? 14 : 8) }}
          onPress={() => onPress1()}
        >
          <Text style={styles.textButton}>
            {action}
          </Text>
        </TouchableOpacity>
      )
    }

    this.renderIconButton = () => {
      return (
        <TouchableOpacity onPress={() => onPress2()} >
          <Image
            source={images.iconScanQRCode}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      )
    }

    this.renderDownButton = () => {
      return (
        <TouchableOpacity onPress={onDownButtonPress}>
          <Image
            source={images.downButton}
            style={{
              marginLeft: 15
            }}
          />
        </TouchableOpacity>
      )
    }

    this.renderIconSend = () => {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {this.renderTextButton()}
          {action !== 'Max' ? this.renderIconButton() : this.renderButtonAmout()}
        </View>
      )
    }

    this.renderIconClear = () => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.clearText}>
            <Image source={images.iconCloseSearch} style={styles.iconClose} />
          </TouchableOpacity>
        </View>
      )
    }

    this.renderPasteButton = () => {
      return (
        <TouchableOpacity
          onPress={async () => {
            const content = await Clipboard.getString()
            if (content) {
              onChangeText(content)
            }
          }}
        >
          <View style={{ padding: 15 }}>
            <Text style={styles.pasteText}>Paste</Text>
          </View>
        </TouchableOpacity>
      )
    }

    const font = value !== '' ? 'OpenSans-Semibold' : 'OpenSans'

    return (
      <View style={[styles.container, style]}>
        {isShowDownButton &&
          this.renderDownButton()
        }
        <TextInput
          ref={(ref) => { this.textInput = ref }}
          autoFocus={autoFocus}
          onFocus={onFocus}
          numberOfLines={1}
          value={value}
          keyboardAppearance="dark"
          underlineColorAndroid="transparent"
          style={[
            styles.textInput,
            styles.placeholder,
            styles.changeText,
            { fontFamily: font },
            styleTextInput
          ]}
          placeholder={placeholder}
          placeholderTextColor={AppStyle.greyTextInput}
          onChangeText={this.onChangeText}
          keyboardType={keyboardType}
        />
        {value !== '' && !action && this.renderIconClear()}
        {value === '' && needPasteButton && this.renderPasteButton()}
        {(action === 'Paste' || action === 'Max') && this.renderIconSend()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: AppStyle.backgroundTextInput,
    borderRadius: 5
  },
  textInput: {
    flex: 1,
    padding: 15,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    color: AppStyle.secondaryTextColor
  },
  // placeholder: {
  //   fontFamily: 'OpenSans',
  //   fontSize: 14,
  //   color: appStyle.greyTextInput
  // },
  iconClose: {
    width: 25,
    height: 25,
    marginRight: 15
  },
  textButton: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainColor
  },
  buttonBlue: {
    backgroundColor: '#0E1428',
    width: 66,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11
  },
  // changText: {
  //   fontFamily: 'OpenSans-Semibold',
  //   fontSize: 14,
  //   color: 'black'
  // },
  iconStyle: {
    width: 35,
    height: 25,
    marginRight: 14,
    tintColor: AppStyle.mainColor
  },
  pasteText: {
    color: AppStyle.mainColor,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16
  }
})
