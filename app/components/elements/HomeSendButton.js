import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import ActionButton from './ActionButton'
// import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569
export default class HomeSendButton extends Component {
  static propTypes = {
    isShow: PropTypes.bool.isRequired,
    action: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      isShow: null
    }
  }

  _toggleSendButton(isShow) {
    if (isShow !== this.state.isShow) {
      this.setState({
        isShow
      })
    }
  }

  render() {
    const { action, isShow } = this.props
    const shouldShow = this.state.isShow !== null ? this.state.isShow : isShow

    if (!shouldShow) {
      return <View />
    }
    return (
      <ActionButton
        style={{
          height: isSmallScreen ? 30 : 70,
          borderRadius: isSmallScreen ? 15 : 35,
          paddingHorizontal: isSmallScreen ? 8 : 17
        }}
        buttonItem={{
          // name: constant.SEND,
          icon: images.iconSendNew,
          background: '#121734'
        }}
        action={action}
        styleText={{ color: AppStyle.mainColor, fontSize: 16 }}
        styleIcon={{
          tintColor: AppStyle.mainColor,
          marginLeft: 0,
          height: isSmallScreen ? 20 : 32
        }}
      />
    )
  }
}
