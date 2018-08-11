import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import FadeText from '../elements/FadeText'

export default class FadeTextExam extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          padding: 40
        }}
      >
        <TouchableOpacity
          onPress={() => this.fadeText.changText('New Text')}
        >
          <Text>Change Text</Text>
        </TouchableOpacity>
        <FadeText
          ref={ref => (this.fadeText = ref)}
          text1="DefaulText"
          text2="DefaulText"
          style={{ marginTop: 30 }}
          text1Style={{}}
          text2Style={{}}
          onChange={(isShow) => { }}
        />
      </View>
    )
  }
}
