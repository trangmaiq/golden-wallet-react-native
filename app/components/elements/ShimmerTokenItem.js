import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image
} from 'react-native'
import Shimmer from 'react-native-shimmer'
import { observer } from 'mobx-react/native'
import AddressTokenStore from '../../stores/AddressTokenStore'
import images from '../../commons/images'

@observer
export default class ShimmerTokenItem extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  render() {
    const loading = AddressTokenStore.isLoading
    if (loading) {
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
