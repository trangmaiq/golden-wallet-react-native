import React, { Component } from 'react'
import { Animated, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

export default class KeyBoardButton extends Component {
  static propTypes = {
    content: PropTypes.string,
    onPress: PropTypes.func,
    // style: PropTypes.object
  }
  static defaultProps = {
    content: '',
    onPress: () => { },
    // style: {}
  }

  constructor(props) {
    super(props)
    this.state = {
      scale: new Animated.Value(1)
    }
  }

  anim() {
    Animated.sequence([
      Animated.timing(this.state.scale, {
        toValue: 1.3,
        duration: 125
      }),
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 125
      })
    ]).start()
  }

  render() {
    const { content, onPress, style, contentStyle } = this.props
    const { scale } = this.state
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.anim()
          onPress()
        }}
        style={[styles.container, style]}
      >
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{
                scale
              }]
            },
            style
          ]}
        >
          <Text
            style={contentStyle}
          >
            {content}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  animatedView: {

  }
})
