import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import AppStyle from '../../commons/AppStyle'

const { width, height } = Dimensions.get('window')

export default class BlindScreen extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  state = {
    isShow: false
  }

  showBlind() {
    this.setState({
      isShow: true
    })
  }

  hideBlind() {
    this.setState({
      isShow: false
    })
  }

  render() {
    const { isShow } = this.state
    if (!isShow) {
      return <View />
    }
    return (
      <View style={styles.container} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: AppStyle.backgroundColor
  }
})
