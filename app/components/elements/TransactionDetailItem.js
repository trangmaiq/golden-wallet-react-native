import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'

export default class TransactionDetailItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    detailItem: PropTypes.object,
    action: PropTypes.func,
    index: PropTypes.number.isRequired
  }

  static defaultProps = {
    style: {},
    detailItem: {
      title: 'Value',
      type: constant.SENT,
      subtitle: '-0.0028 ETH'
    },
    action: () => { }
  }

  render() {
    const {
      style,
      detailItem,
      action,
      index
    } = this.props

    const {
      title,
      subtitle,
      type
    } = detailItem

    let styleSubtitle = {
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
      color: AppStyle.secondaryTextColor
    }

    if (type === constant.SENT && title === 'Value') {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorDown
      }
    }

    if (type === constant.RECEIVED && title === 'Value') {
      styleSubtitle = {
        fontSize: 18,
        fontFamily: 'OpenSans-Semibold',
        color: AppStyle.colorUp
      }
    }

    return (
      <TouchableOpacity onPress={() => { action() }}>
        <View style={[styles.container, style]}>
          {index > 0 &&
            <View
              style={{
                height: 1,
                backgroundColor: AppStyle.colorLines
              }}
            />
          }
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
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor,
    marginTop: 20
  }
})
