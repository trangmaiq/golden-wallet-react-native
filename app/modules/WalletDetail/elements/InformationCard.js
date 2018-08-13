import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'
import FadeText from './FadeText'

@observer
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

  onSecretPress = () => {
    const { data } = this.props
    const { cardItem } = data
    const { isHideValue } = cardItem
    cardItem.setHideValue(!isHideValue)
    cardItem.update()
  }

  render() {
    const {
      data,
      style,
      titleStyle,
      mainSubTitleStyle,
      viceSubTitleStyle
    } = this.props

    const {
      titleText,
      mainSubTitleText,
      viceSubTitleText,
      cardItem
    } = data

    const { isHideValue } = cardItem

    return (
      <View style={[style]}>
        <View style={{
          flexDirection: 'row'
        }}
        >
          <Text style={[
            titleStyle
          ]}
          >{titleText}
          </Text>
          <TouchableOpacity
            style={{
              marginLeft: 10,
              justifyContent: 'center'
            }}
            onPress={this.onSecretPress}
          >
            <Image
              style={{
                resizeMode: 'contain',
                alignSelf: 'center'
              }}
              source={isHideValue ? images.iconHide : images.iconShow}
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
            isShow={isHideValue}
            textStyle={[
              mainSubTitleStyle
            ]}
          />
          <FadeText
            text={viceSubTitleText}
            isShow={isHideValue}
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
