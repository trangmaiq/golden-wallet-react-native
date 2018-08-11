import React, { Component } from 'react'
import { ScrollView } from 'react-native'
import InputWithAction from '../elements/InputWithActionItem'

export default class InputWithACtionExam extends Component {
  render() {
    return (
      <ScrollView style={{ margin: 20 }}>
        <InputWithAction
          placeholder="Address Name"
        />
        <InputWithAction
          placeholder="Receive address"
          onPress1={() => alert('hahaha')}
          onPress2={() => alert('hoho')}
          action="Paste"
          style={{ height: 54, borderRadius: 14, marginTop: 10 }}
        />
        <InputWithAction
          placeholder="Balance: $0"
          onPress1={() => alert('See all')}
          onPress2={() => alert('what')}
          action="Max"
          style={{ height: 54, borderRadius: 14, marginTop: 10 }}
        />
      </ScrollView>
    )
  }
}
