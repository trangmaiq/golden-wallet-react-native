import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import constant from './../../commons/constant'
import images from './../../commons/images'
import AppStyle from './../../commons/AppStyle'
import NavStore from '../../stores/NavStore'
import HapticHandler from '../../Handler/HapticHandler'
import LayoutUtils from '../../commons/LayoutUtils'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const extraBottom = LayoutUtils.getExtraBottom()

export default class SendingPopup extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  componentDidMount() {
    HapticHandler.NotificationSuccess()
  }

  render() {
    const { navigation } = this.props
    const { transactionDetailInfo } = navigation.state.params
    const heightImage = isSmallScreen ? { height: height * 0.2 } : {}
    return (
      <View style={styles.container}>
        <Image
          source={images.imageSendSuccess}
          style={heightImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {constant.TITLE_SEND_SUCCESS}
        </Text>
        <Text style={styles.subTittle}>
          {constant.SUB_TITTLE_SEND_SUCCESS}
        </Text>
        <View style={styles.viewButtonBottom}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TransactionDetailInfoScreen', {
                transactionDetailInfo
              })
            }}
          >
            <Text
              style={[styles.textDetail, { textDecorationLine: 'underline', marginBottom: 5 }]}
            >
              {constant.TEXT_VIEW_DETAIL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonReturn}
            onPress={() => {
              NavStore.closeModal()
            }}
          >
            <Text style={[styles.textDetail, { color: AppStyle.mainColor }]}>
              {constant.RETURN_WALLET}
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
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    maxWidth: 215,
    fontFamily: 'OpenSans-Bold',
    fontSize: 28,
    color: AppStyle.colorUp,
    marginTop: isSmallScreen ? 15 : 30
  },
  subTittle: {
    textAlign: 'center',
    paddingHorizontal: 40,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 16,
    color: AppStyle.secondaryTextColor,
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
    bottom: 40 + extraBottom
  }
})
