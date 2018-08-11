import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'

export default class Loading extends Component {
  static propTypes = {
    isShowLoading: PropTypes.bool,
    color: PropTypes.string
  }

  static defaultProps = {
    isShowLoading: true,
    color: AppStyle.mainColor
  }
  render() {
    const { width } = Dimensions.get('window')
    const {
      isShowLoading = true,
      color
    } = this.props
    return (
      <View
        style={{
          width,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size="small" color={color} />
        {isShowLoading &&
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              color: '#fff'
            }}
          >
            LOADING
          </Text>
        }
      </View>
    )
  }
}
