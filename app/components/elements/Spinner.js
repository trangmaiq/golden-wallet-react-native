import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import GoldenLoading from './GoldenLoading'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default class Spinner extends Component {
  static propTypes = {
    style: PropTypes.array
  }

  static defaultProps = {
    style: []
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  _show = () => {
    this.setState({
      visible: true
    })
  }

  _hide = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const {
      style
    } = this.props
    const { visible } = this.state
    if (!visible) {
      return <View key="invisible" />
    }
    return (
      <View key="visible" style={[styles.container, { backgroundColor: 'rgba(10,15,36,0.8)' }, style]}>
        <GoldenLoading />
      </View>
    )
  }
}
