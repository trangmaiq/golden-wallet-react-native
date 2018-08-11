import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'

export default class AddressItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    address: PropTypes.string,
    onPress: PropTypes.func
  }
  static defaultProps = {
    name: '',
    address: '',
    onPress: () => { }
  }

  render() {
    const { name, address, onPress } = this.props
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress()}
      >
        <View>
          <Text
            style={styles.addressName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Text
            style={styles.address}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {address}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 14,
    backgroundColor: AppStyle.backgroundTextInput
  },
  addressName: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: '#4a90e2'
  },
  address: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'CourierNewBold',
    fontWeight: 'bold',
    fontSize: 12,
    color: AppStyle.warmGreyColor,
    marginTop: 9
  }
})
