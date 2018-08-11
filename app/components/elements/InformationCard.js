import React, { Component } from 'react'
import {
  View,
  // StyleSheet,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import WalletStore from '../../stores/WalletStore'
import images from '../../commons/images'
import FadeText from './FadeText'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

export default class InformationCard extends Component {
  static propTypes = {
    data: PropTypes.object,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    mainSubTitleStyle: PropTypes.object,
    viceSubTitleStyle: PropTypes.object
  }

  static defaultProps = {
    data: {
      titleText: 'Title',
      mainSubTitleText: 'MainText',
      viceSubTitleText: 'ViceText'
    },
    style: {

    },
    titleStyle: {

    },
    mainSubTitleStyle: {

    },
    viceSubTitleStyle: {

    }
  }

  constructor(props) {
    super(props)
    this.state = {
      enableSecretBalance: WalletStore.enableSecretBalance
    }
  }

  _handleSecretBalance = debounce((wallet, index) => {
    WalletStore.editWallet(wallet, index)
  })

  actionClicked = false

  render() {
    const {
      data,
      style,
      titleStyle,
      mainSubTitleStyle,
      viceSubTitleStyle
    } = this.props

    const {
      cardItem,
      index,
      titleText,
      mainSubTitleText,
      viceSubTitleText
    } = data

    // let enableSecretBalance = true
    // if (this.actionClicked) {
    //   enableSecretBalance = this.state.enableSecretBalance
    // } else {
    //   enableSecretBalance = cardItem.enableSecretBalance
    // }
    const { enableSecretBalance } = this.state
    return (
      <View style={[style]}>
        <View style={{
          flexDirection: 'row'
        }}
        >
          <Text style={[
            {},
            titleStyle
          ]}
          >{titleText}
          </Text>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center'
            }}
            onPress={() => {
              // this.actionClicked = true
              if (!enableSecretBalance) {
                NavigationStore.showModal(ScreenID.UnlockScreen, {
                  onUnlockToEdit: () => {
                    setTimeout(() => {
                      const secretCard = { ...cardItem, enableSecretBalance: true }
                      // this.setState({
                      //   enableSecretBalance: true
                      // }, () => {
                      //   this._handleSecretBalance(secretCard, index)
                      // })
                      this.setState({
                        enableSecretBalance: true
                      })
                      WalletStore.enableSecretBalance = true
                      this._handleSecretBalance(secretCard, index)
                    }, 100)
                  },
                  isEdit: true
                }, true)
              } else {
                const secretCard = { ...cardItem, enableSecretBalance: false }
                this.setState({
                  enableSecretBalance: false
                })
                WalletStore.enableSecretBalance = false
                this._handleSecretBalance(secretCard, index)
              }
            }}
          >
            <Image
              style={{
                resizeMode: 'contain',
                alignSelf: 'center'
              }}
              source={!enableSecretBalance ? images.iconHide : images.iconShow}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          marginTop: 20,
          alignItems: 'center'
        }}
        >
          <FadeText
            text={mainSubTitleText}
            isShow={!enableSecretBalance}
            textStyle={[
              mainSubTitleStyle
            ]}
          />
          <FadeText
            text={viceSubTitleText}
            isShow={!enableSecretBalance}
            textStyle={[
              viceSubTitleStyle
            ]}
            securityText=" "
          />
        </View>
      </View>
    )
  }
}
