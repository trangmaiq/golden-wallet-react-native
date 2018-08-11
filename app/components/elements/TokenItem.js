import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import PropsTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import AppStyle from '../../commons/AppStyle'
import images from '../../commons/images'
import WalletStore from '../../stores/WalletStore'
import Helper from '../../commons/Helper'
import FadeText from './FadeText'

@observer
export default class TokenItem extends Component {
  static propTypes = {
    title: PropsTypes.string,
    subtitle: PropsTypes.string,
    numberEther: PropsTypes.string,
    dollaEther: PropsTypes.string,
    style: PropsTypes.object,
    styleUp: PropsTypes.object,
    onPress: PropsTypes.func,
    isSelectCoin: PropsTypes.bool
  }

  static defaultProps = {
    title: null,
    subtitle: null,
    numberEther: null,
    dollaEther: 0,
    style: null,
    styleUp: null,
    onPress: () => { },
    isSelectCoin: false
  }

  state = {
    imageNotFound: true
  }

  _renderImageIcon(title, subtitle) {
    const firstCharacter = subtitle.toUpperCase().substring(0, 1)
    const iconImage = { uri: Helper.getIconCoin(title), cache: 'force-cache' }
    const { imageNotFound } = this.state
    if (subtitle === 'Ethereum') {
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
          onLoad={() => this.setState({ imageNotFound: false })}
        />
      </View>
    )
  }

  render() {
    const {
      title,
      subtitle,
      numberEther,
      dollaEther,
      style,
      styleUp,
      onPress,
      isSelectCoin
    } = this.props

    const { enableSecretBalance } = WalletStore
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.container, style]}>
          <View style={[styles.viewUp, styleUp]}>
            {this._renderImageIcon(title, subtitle)}
            <View style={[styles.viewTitle]}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                {title}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.subTitle]}
              >
                {subtitle}
              </Text>
            </View>
            {!isSelectCoin &&
              <View style={styles.viewEther}>
                <FadeText
                  text={`${numberEther}`}
                  isShow={!enableSecretBalance}
                  textStyle={[
                    styles.numberEther
                  ]}
                  style={{ right: 0, alignItems: 'flex-end' }}
                />
                <FadeText
                  text={`$${dollaEther}`}
                  isShow={!enableSecretBalance}
                  textStyle={[
                    styles.dollaEther
                  ]}
                  style={{ right: 0, alignItems: 'flex-end' }}
                />
              </View>
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    fontFamily: AppStyle.mainFont,
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
