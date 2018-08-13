import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'

export default class HomePendingTransaction extends PureComponent {
  static propTypes = {
    numberOfPending: PropTypes.number,
    style: PropTypes.number
  }

  static defaultProps = {
    numberOfPending: 0,
    style: 0
  }

  constructor(props) {
    super(props)
    this.rotate_value = new Animated.Value(0)
  }

  componentDidMount() {
    this._startAnimation()
  }

  _startAnimation = () => {
    Animated.loop(Animated.timing(this.rotate_value, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    })).start()
  }

  render() {
    const { numberOfPending, style } = this.props
    return (
      <View style={[styles.container, style]}>
        <Animated.Image
          style={[{
            transform: [
              {
                rotate: this.rotate_value.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '720deg']
                })
              }
            ],
            tintColor: '#4A90E2'
          }]}
          source={images.iconPending}
        />
        <Text style={styles.pendingText}>{`Pending (${numberOfPending})`}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pendingText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: '#4A90E2',
    marginLeft: 4
  }
})
