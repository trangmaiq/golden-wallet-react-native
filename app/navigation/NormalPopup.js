import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback
  // Button
} from 'react-native'
import PropsType from 'prop-types'
import AppStyle from '../commons/AppStyle'

const { width } = Dimensions.get('window')
const widthOfPopup = width * 0.7

export default class NormalPopup extends Component {
  static propTypes = {
    title: PropsType.string,
    onClose: PropsType.func
  }

  static defaultProps = {
    title: ' ',
    onClose: () => { }
  }

  render() {
    const { title, onClose } = this.props

    return (
      <View style={styles.container}>
        <View style={{ padding: 16, marginBottom: 10 }}>
          <Text
            style={styles.title}
          >{title}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.button}>
          <TouchableWithoutFeedback
            onPress={() => {
              onClose()
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: AppStyle.mainColor, fontFamily: AppStyle.mainFontBold }}>OK</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: widthOfPopup,
    backgroundColor: '#0A0F24',
    borderRadius: 14
  },
  title: {
    fontFamily: AppStyle.mainFont,
    color: AppStyle.Color.gray,
    fontSize: 16,
    textAlign: AppStyle.Align.center
  },
  button: {
    width: widthOfPopup,
    height: 44
  },
  line: {
    height: 1,
    width: widthOfPopup,
    backgroundColor: AppStyle.Color.lineColor
  }
})
