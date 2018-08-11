import React, { Component } from 'react'
import {
  View,
  Dimensions
} from 'react-native'
import Slider from '../../../Libs/react-native-snap-slider/SnapSlider'

const { width } = Dimensions.get('window')

export default class TestSlider extends Component {
  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <Slider
          containerStysle={{ width }}
          onWidth={width}
          items={[
            { value: 0, label: 'safe low' },
            { value: 1 },
            { value: 2, label: 'standard', margin: 25 },
            { value: 3 },
            { value: 4, label: 'fast' }
          ]}
          defaultItem={0}
          onSlidingComplete={(item) => { }}
        />
      </View>
    )
  }
}
