import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import TransactionItem from '../elements/TransactionsItem'
import constant from '../../commons/constant'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    type: constant.SEND,
    balance: '- 0.0044 ETH',
    date: 'Today 01:02 AM',
    balanceUSD: '$37.87',
    status: 1
  },
  {
    type: constant.RECEIVED,
    balance: '- 0.0044 ETH',
    date: 'Today 01:02 AM',
    balanceUSD: '$37.87',
    status: 1
  },
  {
    type: constant.SEND,
    balance: '- 0.0044 ETH',
    date: 'Today 01:02 AM',
    balanceUSD: '$37.87',
    status: 0
  }
]

export default class TransactionItemExam extends Component {
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
        <TransactionItem
          transactionItem={data[0]}
          action={() => { }}
        />
        <TransactionItem
          transactionItem={data[1]}
          action={() => { }}
        />
        <TransactionItem
          transactionItem={data[2]}
          action={() => { }}
        />
      </View>
    )
  }
}
