import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native'

import PropTypes from 'prop-types'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')
const isIPX = height === 812

export default class CreateSuccessScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }
  static propTypes = {
    onSubButtonPress: PropTypes.func,
    onMainButtonPress: PropTypes.func
  }

  static defaultProps = {
    onSubButtonPress: () => { },
    onMainButtonPress: () => { }
  }

  componentDidMount() {
    HapticHandler.NotificationSuccess()
  }

  render() {
    const { onSubButtonPress, onMainButtonPress } = this.props
    const heightImage = height - marginTop - 474
    const imgStyle = { height: heightImage }
    return (
      <View style={styles.container}>
        <Image
          style={imgStyle}
          resizeMode="contain"
          source={images.createSuccess}
        />
        <Text style={styles.successText}>Success!</Text>
        <Text style={styles.desText}>
          You’ve created your wallet. Make sure to keep your
          12 word secret phrase safe and private.
          You’ll need it to restore your wallet if your device
          is lost or broken. So guard it with your life.
        </Text>
        <View style={styles.viewButtonBottom}>
          <TouchableOpacity
            onPress={onSubButtonPress}
          >
            <Text
              style={[styles.textDetail, { textDecorationLine: 'underline', marginBottom: 5 }]}
            >
              Later
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonReturn}
            onPress={onMainButtonPress}
          >
            <Text style={[styles.textDetail, { color: AppStyle.mainColor }]}>
              Backup Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 37,
    backgroundColor: AppStyle.backgroundColor,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  successText: {
    fontSize: 26,
    color: AppStyle.colorUp,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 20
  },
  desText: {
    textAlign: 'center',
    fontSize: 16,
    color: AppStyle.secondaryTextColor,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    marginTop: 10
  },
  buttonReturn: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#121734'
  },
  textDetail: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold'
  },
  viewButtonBottom: {
    position: 'absolute',
    bottom: isIPX ? 120 : 90
  }
})
