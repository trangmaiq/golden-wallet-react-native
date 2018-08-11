import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'

export default class AmountInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    prefix: PropTypes.string,
    postfix: PropTypes.string,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
    format: PropTypes.func
  }

  static defaultProps = {
    value: '',
    prefix: '',
    postfix: '',
    defaultValue: '0.0',
    style: {},
    format: () => { }
  }

  constructor(props) {
    super(props)
    this.state = {
      fontSize: 60,
      color: AppStyle.greyTextInput
    }
  }

  format = (val) => {
    return `${val.toFixed(0).replace(/./g, (c, i, a) => {
      return i && c !== '.' && ((a.length - i) % 3 === 0) ? `.${c}` : c
    })}`
  }

  validateValue() {

  }

  validateState() {

  }

  render() {
    const {
      value,
      style,
      prefix,
      postfix,
      format,
      defaultValue
    } = this.props
    const {
      fontSize,
      color
    } = this.state
    this.validateState()
    return (
      <View
        style={[]}
      >
        <Text
          style={[
            style,
            {
              fontSize,
              color
            }
          ]}
        >
          {prefix}{value !== '' ? format(value) : defaultValue}{postfix}
        </Text>
      </View>
    )
  }
}
