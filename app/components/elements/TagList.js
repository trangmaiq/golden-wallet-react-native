import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import HapticHandler from '../../Handler/HapticHandler'

const { width } = Dimensions.get('window')

export default class TagList extends Component {
  static propTypes = {
    isShowOrder: PropTypes.bool,
    style: PropTypes.object,
    arrayMnemonic: PropTypes.array,
    onItemPress: PropTypes.func,
    buttonStates: PropTypes.array,
    isCenter: PropTypes.bool
  }

  static defaultProps = {
    style: {
      paddingVerticalOfItem: 20,
      numberOfWordInRow: 3,
      margin: 20,
      backgroundColor: '#dfdfdf',
      itemBackgroundColor: '#eeeeee',
      itemFontSize: 14,
      userInteractionEnabled: false,
      itemTextColor: '#000',
      fontFamily: 'Helvetica',
      fontWeight: 'regular',
      marginTop: 0
    },
    arrayMnemonic: [],
    onItemPress: () => { },
    buttonStates: [],
    isShowOrder: false,
    isCenter: false
  }

  _checkDisableButton(index) {
    return this.props.buttonStates.length === 0
      ? !this.props.style.userInteractionEnabled
      : !this.props.buttonStates[index]
  }

  render() {
    const {
      arrayMnemonic,
      style,
      onItemPress,
      isShowOrder,
      isCenter
    } = this.props
    const {
      numberOfWordInRow,
      paddingVerticalOfItem,
      backgroundColor,
      itemBackgroundColor,
      margin,
      itemFontSize,
      itemTextColor,
      fontFamily,
      fontWeight,
      marginTop
    } = style

    const itemWidth = (width - paddingVerticalOfItem - margin * 2) / numberOfWordInRow
    const haflPaddingOfVerticalItem = paddingVerticalOfItem / 2
    const textAlign = isCenter ? { textAlign: 'center' } : {}
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor,
          padding: haflPaddingOfVerticalItem,
          margin,
          marginTop,
          borderRadius: 14
        }}
      >
        {arrayMnemonic.map((str, index) => (
          <View
            key={index}
            style={{ width: itemWidth, padding: haflPaddingOfVerticalItem }}
          >
            <TouchableOpacity
              onPress={() => {
                HapticHandler.ImpactLight()
                onItemPress(str)
              }}
              disabled={this._checkDisableButton(index)}
              style={{
                height: width >= 375 ? 32 : 28,
                borderRadius: 5,
                backgroundColor: this._checkDisableButton(index) ? backgroundColor : (str === '' ? backgroundColor : itemBackgroundColor),
                padding: 4,
                justifyContent: 'center'
              }}
            >
              <Text
                style={[{
                  fontFamily,
                  fontWeight,
                  color: itemTextColor,
                  fontSize: itemFontSize
                }, textAlign]}
              >
                {isShowOrder ? str === '' ? str : `${index + 1}. ${str}` : str}
              </Text>
            </TouchableOpacity>
          </View>
        ))
        }
      </View>
    )
  }
}
