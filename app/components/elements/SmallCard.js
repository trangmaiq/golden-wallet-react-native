import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import images from '../../commons/images'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569

export default class SmallCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    imageCard: PropTypes.number.isRequired,
    imageBackground: PropTypes.string,
    titleTextStyle: PropTypes.object,
    subtitleTextStyle: PropTypes.object,
    onPress: PropTypes.func,
    style: PropTypes.object,
    imageBackgroundStyle: PropTypes.object
  }

  static defaultProps = {
    titleTextStyle: {},
    subtitleTextStyle: {},
    imageBackground: null,
    onPress: () => { },
    style: {},
    imageBackgroundStyle: {}
  }

  render() {
    const {
      title,
      subtitle,
      imageCard,
      imageBackground,
      imageBackgroundStyle,
      titleTextStyle,
      subtitleTextStyle,
      onPress,
      style
    } = this.props
    const styleImage = isSmallScreen ? { height: height * 0.2 } : {}
    const heightImageBackground = isSmallScreen ? height * 0.2 + 60 : 214
    return (
      <TouchableOpacity
        onPress={onPress}
      >
        <View
          style={[styles.container, style]}
        >
          {imageBackground &&
            <Image
              source={images[imageBackground]}
              style={[{
                position: 'absolute',
                width: width - 40,
                height: heightImageBackground,
                borderRadius: 14
              }, imageBackgroundStyle]}
            />
          }
          <View
            style={{
              justifyContent: 'center',
              maxWidth: width - 150
            }}
          >
            <Text style={[styles.title, titleTextStyle]}>{title}</Text>
            <Text style={[styles.subtitle, subtitleTextStyle]}>{subtitle}</Text>
          </View>
          <Image
            resizeMode="contain"
            style={styleImage}
            source={imageCard}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 30,
    paddingHorizontal: 15,
    width: width - 30,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    backgroundColor: AppStyle.backgroundColor,
    borderRadius: 14,
    margin: 5,
    elevation: 4
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: AppStyle.mainTextColor
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: isSmallScreen ? 10 : 12,
    color: AppStyle.secondaryTextColor
  }
})
