import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import Shimmer from 'react-native-shimmer'
import PropsTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../../commons/images'

@observer
export default class ShimmerTokenItem extends Component {
  static propTypes = {
    visible: PropsTypes.bool.isRequired
  }

  static defaultProps = {

  }

  render() {
    const { visible } = this.props
    if (visible) {
      return (
        <View style={styles.container}>
          <Shimmer>
            <Image
              style={{ borderRadius: 5 }}
              source={images.shimmerToken}
            />
          </Shimmer>
        </View>
      )
    }
    return (
      <View />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15
  }
})
