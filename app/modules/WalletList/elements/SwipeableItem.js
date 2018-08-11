import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Swipeable from 'react-native-swipeable'
import commonStyle from '../../../commons/commonStyles'
import AppStyle from '../../../commons/AppStyle'

export default class SwipeableItem extends Component {
  static propTypes = {
    information: PropTypes.object.isRequired,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
    subTitleStyle: PropTypes.object,
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
    onItemPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    titleStyle: {},
    subTitleStyle: {},
    onDeleteItem: undefined,
    onEditItem: undefined,
    onItemPress: () => { }
  }

  _renderLeftButtons() {
    return ([
      <TouchableOpacity style={styles.leftSwipeItem}>
        <Text style={styles.editTextStyle}>Send</Text>
      </TouchableOpacity>
    ])
  }

  _turnOffSwipe() {
    this.swipeable && this.swipeable.recenter()
  }

  _renderRightButtons() {
    const {
      onDeleteItem,
      onEditItem
    } = this.props
    const rightButtons = []
    if (onEditItem) {
      /* eslint-disable-next-line */
      rightButtons.push(
        <TouchableOpacity
          style={[
            styles.rightSwipeItem,
            { backgroundColor: AppStyle.swipeButtonBackground }
          ]}
          onPress={() => {
            this.props.onEditItem()
            this._turnOffSwipe()
          }}
        >
          <Text style={styles.editTextStyle}>Edit</Text>
        </TouchableOpacity>)
    }
    if (onDeleteItem) {
      /* eslint-disable-next-line */
      rightButtons.push(
        <TouchableOpacity
          style={[
            styles.rightSwipeItem,
            { backgroundColor: '#D0021B' }
          ]}
          onPress={() => {
            this.props.onDeleteItem()
            this._turnOffSwipe()
          }}
        >
          <Text style={styles.deleteTextStyle}>Delete</Text>
        </TouchableOpacity>)
    }
    return rightButtons
  }

  render() {
    const {
      information,
      onItemPress,
      titleStyle,
      subTitleStyle
    } = this.props
    const {
      name,
      address
    } = information
    return (
      <Swipeable
        leftButtonWidth={70}
        rightButtons={this._renderRightButtons()}
        rightButtonWidth={70}
        style={[this.props.style]}
        ref={(ref) => { this.swipeable = ref }}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => {
            onItemPress()
            // this.recenter()
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#141A2E'
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styles.mainTextStyle, titleStyle]}
            >{name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styles.subTextStyle, subTitleStyle, commonStyle.fontAddress]}
            >{address}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Swipeable >
    )
  }
}

const styles = StyleSheet.create({
  leftSwipeItem: {
    width: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: AppStyle.swipeButtonBackground
  },
  rightSwipeItem: {
    width: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  deleteTextStyle: {
    color: 'white',
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16
  },
  editTextStyle: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16
  },
  mainTextStyle: {
    color: '#4A90E2',
    fontFamily: AppStyle.mainFontSemiBold,
    fontSize: 16,
    marginHorizontal: 20
  },
  subTextStyle: {
    color: '#9B9B9B',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    marginHorizontal: 20
  }
})
