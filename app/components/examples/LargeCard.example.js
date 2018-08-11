import React, { Component } from 'react'
import { View, Platform, ScrollView } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import LargeCard from '../elements/LargeCard'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    background: 'backgroundBlue',
    cardName: 'Jason Nguyen dai dai dai dai dai dai dai',
    balance: '132.28 ETH',
    balanceUSD: '$30.89',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    background: 'backgroundGreen',
    cardName: 'Jason Nguyen',
    balance: '132.28 ETH',
    balanceUSD: '$30.89',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    background: 'backgroundBlack',
    cardName: 'Jason Nguyen',
    balance: '132.28 ETH',
    balanceUSD: '$30.89',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  }
]

export default class LargeCardExam extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }
  componentDidMount() {
  }
  render() {
    return (
      <ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            marginTop: marginTop + 20
          }}
        >
          <LargeCard cardItem={data[0]} style={{ marginTop: 20 }} />
          <LargeCard cardItem={data[1]} style={{ marginTop: 20 }} />
          <LargeCard cardItem={data[2]} style={{ marginTop: 20 }} />
          <LargeCard isNew style={{ marginTop: 20 }} />
          <LargeCard cardItem={data[0]} style={{ marginTop: 20 }} type="back" />
        </View>
      </ScrollView>
    )
  }
}
