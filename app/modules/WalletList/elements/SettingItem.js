import React, { PureComponent } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'

export default class SettingItem extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    iconRight: PropTypes.bool,
    subText: PropTypes.string,
    mainText: PropTypes.string.isRequired,
    onPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    iconRight: true,
    subText: ' ',
    onPress: () => { }
  }

  render() {
    const {
      style, iconRight, subText, mainText, onPress
    } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, style]}>
          <Text style={styles.text}>{mainText}</Text>
          {iconRight &&
            <View style={styles.rightField}>
              <Text style={[styles.text, { marginRight: 10 }]}>{subText}</Text>
              <Image source={images.icon_indicator} />
            </View>
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundTextInput,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: AppStyle.borderLinesSetting
  },
  text: {
    color: AppStyle.secondaryTextColor,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold'
  },
  rightField: {
    flexDirection: 'row'
  }
})
