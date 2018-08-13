import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TransactionDetailItem from './../elements/TransactionDetailItem'
import constant from './../../commons/constant'
import images from '../../commons/images'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    title: 'Value',
    type: constant.SEND,
    subtitle: '- 0.0028 ETH'
  },
  {
    title: 'Value',
    type: constant.RECEIVED,
    subtitle: '0.0028 ETH'
  },
  {
    title: 'From',
    subtitle: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  }
]

export default class TransactionDetailItemExam extends Component {
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
          marginTop: marginTop + 20
        }}
      >
        <TransactionDetailItem
          detailItem={data[0]}
          action={() => { }}
        />
        <TransactionDetailItem
          detailItem={data[1]}
          action={() => { }}
        />
        <TransactionDetailItem
          detailItem={data[2]}
          action={() => { }}
          icon={images.iconCopy}
        />
      </View>
    )
  }
}
