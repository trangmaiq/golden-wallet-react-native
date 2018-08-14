import React, { Component } from 'react'
import { View, Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import ManageWalletItem from './../elements/ManageWalletItem'

const marginTop = Platform.OS === 'ios' ? getStatusBarHeight() : 0
const data = [
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  }
]

export default class ManageWalletExam extends Component {
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
        <ManageWalletItem
          wallet={data[0]}
          action={() => { }}
        />
        <ManageWalletItem
          wallet={data[1]}
          action={() => { }}
        />
      </View>
    )
  }
}
