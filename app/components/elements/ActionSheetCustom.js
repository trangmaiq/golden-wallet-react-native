import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'

const { height, width } = Dimensions.get('window')
const isIPX = height === 812

export default class ActionSheetCustom extends PureComponent {
  static propTypes = {
    children: PropTypes.array,
    onCancel: PropTypes.func
  }

  static defaultProps = {
    children: {},
    onCancel: () => { }
  }

  constructor(props) {
    super(props)
    this.bottom = isIPX ? 44 : 10
    const buttonsLength = props.children.length
    this.initOffsetY = buttonsLength * 52 + 60 + this.bottom
    this.offsetY = new Animated.Value(-this.initOffsetY)
  }

  _runAnim(toValue) {
    Animated.timing(
      // Animate value over time
      this.offsetY, // The value to drive
      {
        toValue, // Animate to final value of 1
        duration: 250
      }
    ).start()
  }

  show() {
    this._runAnim(this.bottom)
  }

  hide() {
    this._runAnim(-this.initOffsetY)
  }

  render() {
    const { children, onCancel } = this.props
    return (
      <Animated.View
        style={[styles.container, { bottom: this.offsetY }]}
      >
        <View style={styles.actionButtons}>
          {children}
        </View>
        <TouchableOpacity onPress={onCancel}>
          <View style={styles.CancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: 20,
    flex: 1
  },
  CancelButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: width - 40,
    backgroundColor: AppStyle.backgroundDarkBlue
  },
  cancelText: {
    color: AppStyle.mainColor,
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold'
  },
  actionButtons: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: AppStyle.backgroundDarkBlue
  }
})
