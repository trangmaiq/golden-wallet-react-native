import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import constant from '../../../commons/constant'

export default class TransactionDetailItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    data: PropTypes.object,
    action: PropTypes.func,
    bottomLine: PropTypes.bool
  }

  static defaultProps = {
    style: {},
    data: {
      title: 'Value',
      type: constant.SENT,
      subtitle: '-0.0028 ETH'
    },
    action: () => { },
    bottomLine: true
  }

  get styleSubtitle() {
    const { data } = this.props

    const {
      title, type, isSelf
    } = data
    let styleSubtitle = {
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
      color: AppStyle.secondaryTextColor
    }
    if ((type === constant.SENT && title === 'Value') || isSelf) {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorDown
      }
    } else if (type === constant.RECEIVED && title === 'Value') {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorUp
      }
    }
    return styleSubtitle
  }

  render() {
    const {
      style,
      data,
      action,
      bottomLine
    } = this.props

    const {
      title,
      subtitle
    } = data

    const { styleSubtitle } = this

    return (
      <TouchableOpacity onPress={() => { action() }}>
        <View style={[styles.container, style]}>
          <View style={{}}>
            <Text style={styles.title}>{title}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styleSubtitle]}
            >
              {subtitle}
            </Text>
          </View>
          {bottomLine &&
            <View
              style={{
                height: 1,
                backgroundColor: AppStyle.colorLines,
                marginTop: 20
              }}
            />
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor
  }
})
