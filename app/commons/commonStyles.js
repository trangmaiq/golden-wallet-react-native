import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'
import AppStyle from '../commons/AppStyle'

const { width } = Dimensions.get('window')

const fontWeight = Platform.OS === 'ios' ? { fontWeight: 'bold' } : {}

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: width - 40,
    marginHorizontal: 20,
    backgroundColor: AppStyle.borderLinesSetting
  },
  fontAddress: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    ...fontWeight
  }
})

export default styles
