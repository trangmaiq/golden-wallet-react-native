import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

export default class MoreButton extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    colorDot: PropTypes.string
  }

  static defaultProps = {
    onPress: () => { },
    colorDot: '#4A90E2'
  }

  render() {
    const { onPress, colorDot } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <View style={[styles.dot, { backgroundColor: colorDot }]} />
          <View style={[styles.dot, { backgroundColor: colorDot, marginLeft: 2 }]} />
          <View style={[styles.dot, { backgroundColor: colorDot, marginLeft: 2 }]} />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 2,
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2
  }
})
