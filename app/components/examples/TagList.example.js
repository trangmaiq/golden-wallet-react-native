import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import TagList from './../../components/elements/TagList'
import PropTypes from 'prop-types'

const { width } = Dimensions.get('window')

export default class TagListExample extends Component {
  static propTypes = {
    arrayMnemonic: PropTypes.object
  }

  static defaultProps = {
    arrayMnemonic: ['']
  }

  render() {
    const {
      arrayMnemonic
    } = this.arrayMnemonic

    return (
      <View
        style={{
          marginTop: 30,
          flex: 1
        }}
      >
        <TagList
          arrayMnemonic={{ arrayMnemonic }}
          style={{
            paddingVerticalOfItem: 20,
            numberOfWordInRow: 3,
            margin: 20,
            backgroundColor: '#dfdfdf',
            itemBackgroundColor: '#eeeeee',
            itemFontSize: width >= 375 ? 14 : 10,
            userInteractionEnabled: true
          }}
        />
      </View>
    )
  }
}
