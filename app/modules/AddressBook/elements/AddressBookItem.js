import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../../commons/AppStyle'
import commonStyle from '../../../commons/commonStyles'
import MainStore from '../../../AppStores/MainStore'
import MoreButton from '../../../components/elements/MoreButton'

export default class AddressBookItem extends Component {
  static propTypes = {
    style: PropTypes.object,
    index: PropTypes.number.isRequired,
    action: PropTypes.func
    // onDeletePress: PropTypes.func,
    // onEditPress: PropTypes.func
  }

  static defaultProps = {
    style: {},
    action: () => { }
    // onEditPress: () => { },
    // onDeletePress: () => { }
  }

  get addressBook() {
    const { index } = this.props
    return MainStore.appState.addressBooks[index]
  }

  render() {
    const {
      style, action
    } = this.props

    const { title, address } = this.addressBook

    return (
      <TouchableWithoutFeedback>
        <View style={[styles.container, style]}>
          <View style={{}}>
            <Text style={styles.name}>{title}</Text>
            <Text
              style={[styles.address, commonStyle.fontAddress]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {address}
            </Text>
          </View>
          <MoreButton onPress={action} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppStyle.backgroundTextInput,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: AppStyle.borderLinesSetting,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  }
})
