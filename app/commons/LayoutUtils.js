import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Dimensions, Platform } from 'react-native'

const { width, height } = Dimensions.get('window')

export default class LayoutUtils {
  static getExtraTop() {
    return getStatusBarHeight()
  }

  static getExtraTopAndroid() {
    return Platform.OS === 'android' ? getStatusBarHeight() : 0
  }

  static getExtraBottom() {
    return this.isLongScreenAndroid() ? 48 : 0
  }

  static isLongScreenAndroid() {
    return Platform.OS === 'android' && width / height < 0.5625
  }
}
