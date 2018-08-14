import React, { Component } from 'react'
import {
  Animated,
  Easing
} from 'react-native'

import { observer } from 'mobx-react/native'
import images from '../../../commons/images'

@observer
export default class SyncBalance extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  state = {
    spinValue: new Animated.Value(0)
  }

  startAnimation() {
    Animated.loop(Animated.timing(this.state.spinValue, {
      toValue: 2,
      duration: 2500,
      easing: Easing.linear
    })).start()
  }

  stop() {
    this.state.spinValue.stopAnimation()
  }

  render() {
    // const loading = WalletStore.isFetchingBalance
    const rotation = this.state.spinValue.interpolate({
      inputRange: [0, 2],
      outputRange: ['0deg', '360deg'],
      useNativeDriver: true
    })
    this.startAnimation()

    return (
      <Animated.Image
        style={[
          {
            borderColor: '#FBD249',
            transform: [
              {
                rotate: rotation
              }
            ]
          }
        ]}
        source={images.iconSync}
      />
    )
  }
}
