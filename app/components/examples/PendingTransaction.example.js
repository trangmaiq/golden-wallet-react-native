import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import PendingTransaction from '../elements/PendingTransaction'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0

export default class PendingTransactionExam extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }
  componentDidMount() {
  }
  render() {
    return (

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          marginTop: marginTop + 20
        }}
      >
        <PendingTransaction />
      </View>
    )
  }
}
