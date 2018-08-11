import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import ActionButton from './ActionButton'
import constant from '../../commons/constant'
import images from '../../commons/images'
import WalletStore from '../../stores/WalletStore'
import AppStyle from '../../commons/AppStyle'
import NavigationStore from '../../navigation/NavigationStore'

export default class ButtonSendReveive extends Component {
  static propTypes = {
    style: PropTypes.object,
    openSend: PropTypes.func,
    openReceive: PropTypes.func,
    enable: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    enable: true,
    openSend: () => { },
    openReceive: () => { }
  }

  render() {
    const {
      style,
      openSend,
      openReceive,
      enable
    } = this.props
    return (
      <View style={[styles.container, style]}>
        <ActionButton
          enable={enable}
          style={{ shadowOpacity: 0.2 }}
          buttonItem={{
            name: constant.SEND,
            icon: images.iconSend,
            background: '#121734'
          }}
          action={() => {
            if (WalletStore.selectedWallet.privateKey !== null) {
              openSend()
            } else {
              NavigationStore.showPopup('This wallet can not send a transaction')
            }
          }}
          styleText={{ color: AppStyle.mainColor }}
          styleIcon={{ tintColor: AppStyle.mainColor }}
        />
        <ActionButton
          enable={enable}
          style={{
            marginLeft: 32
          }}
          buttonItem={{
            name: constant.RECEIVE,
            icon: images.iconQrCode,
            background: '#121734'
          }}
          action={openReceive}
          styleText={{ color: AppStyle.backgroundWhite }}
          styleIcon={{ tintColor: AppStyle.backgroundWhite }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})
