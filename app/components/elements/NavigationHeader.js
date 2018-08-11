import React, { Component } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'

export default class NavigationHeader extends Component {
  static propTypes = {
    style: PropTypes.object,
    containerStyle: PropTypes.object,
    headerItem: PropTypes.object,
    titleStyle: PropTypes.object,
    action: PropTypes.func
  }

  static defaultProps = {
    style: {},
    containerStyle: {},
    headerItem: {
      title: '',
      icon: null,
      button: images.backButton
    },
    titleStyle: {},
    action: () => { }
  }

  canPressAction = true

  render() {
    const {
      style,
      containerStyle,
      titleStyle,
      headerItem,
      action
    } = this.props
    const {
      title,
      icon,
      button
    } = headerItem
    return (
      <TouchableWithoutFeedback
        style={containerStyle}
        onPress={Platform.OS === 'ios' ? () => { action() } : debounce(() => {
          action()
        }, 200)}
      >
        <View style={[styles.container, style]}>
          <Image
            source={button}
          />
          {icon &&
            <Image
              style={{
                width: 20,
                height: 30,
                marginLeft: 18
              }}
              source={icon}
            />
          }
          {title &&
            <Text
              style={[styles.titleStyle, { marginLeft: icon ? 10 : 20 }, titleStyle]}
            >
              {title}
            </Text>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15
  },
  titleStyle: {
    fontSize: 20,
    color: AppStyle.mainTextColor,
    fontFamily: AppStyle.mainFontBold
  }
})
