import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import Swipeable from 'react-native-swipeable'
import AppStyle from '../../commons/AppStyle'
import commonStyle from '../../commons/commonStyles'

export default class ManageWalletItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    wallet: PropTypes.object,
    action: PropTypes.func,
    onSendPress: PropTypes.func,
    onDeletePress: PropTypes.func,
    onEditPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    wallet: {
      name: 'Jason Nguyen',
      address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
    },
    action: () => { },
    onSendPress: undefined,
    onEditPress: undefined,
    onDeletePress: undefined
  }

  _renderLeftButtons() {
    const { onSendPress } = this.props
    return ([
      <TouchableOpacity
        onPress={onSendPress}
        style={styles.leftSwipeItem}
      >
        <Text style={styles.editTextStyle}>Send</Text>
      </TouchableOpacity>
    ])
  }

  _turnOffSwipe() {
    this.swipeable && this.swipeable.recenter()
  }

  _renderRightButtons() {
    const { onEditPress, onDeletePress } = this.props
    const rightButtons = [
      <TouchableOpacity
        onPress={() => {
          this._turnOffSwipe()
          onEditPress()
        }}
        style={[
          styles.rightSwipeItem,
          { backgroundColor: AppStyle.swipeButtonBackground }
        ]}
      >
        <Text style={styles.editTextStyle}>Edit</Text>
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={() => {
          this._turnOffSwipe()
          onDeletePress()
        }}
        style={[
          styles.rightSwipeItem,
          { backgroundColor: '#D0021B' }
        ]}
      >
        <Text style={styles.deleteTextStyle}>Delete</Text>
      </TouchableOpacity>
    ]
    return rightButtons
  }

  render() {
    const {
      style,
      wallet,
      action
    } = this.props

    const {
      cardName,
      address
    } = wallet

    return (
      <Swipeable
        ref={(ref) => { this.swipeable = ref }}
        rightButtons={this._renderRightButtons()}
        rightButtonWidth={68}
      >
        <TouchableWithoutFeedback onPress={action} >
          <View style={[styles.container, style]}>
            <View style={{}}>
              <Text style={styles.name}>{cardName}</Text>
              <Text
                style={[styles.address, commonStyle.fontAddress]}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {address}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Swipeable >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyle.backgroundTextInput,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: AppStyle.borderLinesSetting
  },
  name: {
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    color: '#3B7CEC'
  },
  address: {
    fontSize: 12,
    color: AppStyle.secondaryTextColor,
    fontWeight: 'bold',
    marginTop: 10
  },
  leftSwipeItem: {
    width: 71,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: AppStyle.swipeButtonBackground
  },
  rightSwipeItem: {
    width: 71,
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
  }
})
