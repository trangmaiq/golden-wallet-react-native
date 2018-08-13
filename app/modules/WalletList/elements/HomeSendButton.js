import React, { Component } from 'react'
import { observer } from 'mobx-react/native'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import ActionButton from '../../../components/elements/ActionButton'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class HomeSendButton extends Component {
  static propTypes = {
    action: PropTypes.func.isRequired
  }

  render() {
    const { action } = this.props
    const { isShowSendButton } = MainStore.appState

    if (!isShowSendButton) {
      return <View />
    }
    return (
      <ActionButton
        style={{
        }}
        buttonItem={{
          name: constant.SEND,
          icon: images.iconSend,
          background: '#121734'
        }}
        action={action}
        styleText={{ color: AppStyle.mainColor, fontSize: 16 }}
        styleIcon={{ tintColor: AppStyle.mainColor }}
      />
    )
  }
}
