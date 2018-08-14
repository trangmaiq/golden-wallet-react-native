import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'
import PropsTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import Helper from '../../../commons/Helper'
import FadeText from './FadeText'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class TokenItem extends Component {
  static propTypes = {
    indexToken: PropsTypes.number.isRequired,
    style: PropsTypes.object,
    styleUp: PropsTypes.object,
    onPress: PropsTypes.func
  }

  static defaultProps = {
    style: null,
    styleUp: null,
    onPress: () => { }
  }

  state = {
    imageNotFound: true
  }

  get token() {
    const { indexToken } = this.props
    return this.Wallet.tokens[indexToken]
  }

  get Wallet() {
    return MainStore.appState.selectedWallet
  }

  _renderImageIcon(_, symbol) {
    const firstCharacter = symbol.toUpperCase().substring(0, 1)
    const iconImage = { uri: Helper.getIconCoin(symbol), cache: 'force-cache' }
    const { imageNotFound } = this.state
    if (symbol === 'ETH') {
      return (
        <Image
          source={images.iconEther}
          style={styles.image}
          resizeMode="contain"
        />
      )
    }
    return (
      <View style={styles.iconField}>
        <View
          style={[
            styles.iconField,
            { backgroundColor: '#0E1428', position: 'absolute', opacity: imageNotFound ? 1 : 0 }
          ]}
        >
          <Text style={styles.iconText}>{firstCharacter}</Text>
        </View>
        <Image
          source={iconImage}
          style={{
            width: 50,
            height: 50,
            position: 'absolute',
            opacity: imageNotFound ? 0 : 1
          }}
          onProgress={() => this.setState({ imageNotFound: false })}
        />
      </View>
    )
  }

  render() {
    const {
      style,
      styleUp,
      onPress
    } = this.props

    const {
      title, symbol, balanceToken, balanceInDollar
    } = this.token

    const { isHideValue } = this.Wallet

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, style]}>
          <View style={[styles.viewUp, styleUp]}>
            {this._renderImageIcon(title, symbol)}
            <View style={[styles.viewTitle]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                {symbol}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.subTitle]}
              >
                {title}
              </Text>
            </View>
            <View style={styles.viewEther}>
              <FadeText
                text={`${Helper.formatETH(balanceToken)}`}
                isShow={isHideValue}
                textStyle={[
                  styles.numberEther
                ]}
                style={{ right: 0, alignItems: 'flex-end' }}
              />
              <FadeText
                text={`$${Helper.formatUSD(balanceInDollar.toString(10))}`}
                isShow={isHideValue}
                textStyle={[
                  styles.dollaEther
                ]}
                style={{ right: 0, alignItems: 'flex-end' }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    marginHorizontal: 15,
    flex: 1
  },
  viewUp: {
    flexDirection: 'row',
    height: 50,
    flex: 1,
    alignItems: 'center'
  },
  viewTitle: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  viewEther: {
    marginLeft: 8,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  title: {
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16,
    color: AppStyle.mainTextColor
  },
  subTitle: {
    marginTop: 3.5,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 14,
    color: AppStyle.secondaryTextColor
  },
  numberEther: {
    fontSize: 18,
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  dollaEther: {
    fontSize: 14,
    marginTop: 4,
    color: AppStyle.mainTextColor,
    fontFamily: AppStyle.mainFontSemiBold
  },
  iconField: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    color: 'white',
    fontSize: 24,
    fontFamily: AppStyle.mainFontSemiBold
  }
})
