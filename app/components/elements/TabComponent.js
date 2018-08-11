import React, { Component } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'

const list = [
  {
    title: 'TagList',
    key: 'TagListExam'
  },
  {
    title: 'LargeCard',
    key: 'LargeCardExam'
  },
  {
    title: 'ActionButton',
    key: 'ActionButtonExam'
  },
  {
    title: 'HamburgerButton',
    key: 'HamburgerButtonExam'
  },
  {
    title: 'NavigationHeaderExam',
    key: 'NavigationHeaderExam'
  },
  {
    title: 'TransactionItem',
    key: 'TransactionItemExam'
  },
  {
    title: 'PendingTransaction',
    key: 'PendingTransactionExam'
  },
  {
    title: 'TransactionDetailItem',
    key: 'TransactionDetailItemExam'
  },
  {
    title: 'ManageWalletItem',
    key: 'ManageWalletItemExam'
  },
  {
    title: 'Small Card Item',
    key: 'SmallCardItemExam'
  },
  {
    title: 'Token Item',
    key: 'TokenItemExam'
  },
  {
    title: 'Input With Action',
    key: 'InputWithActionExam'
  }, {
    title: 'Sending Popup',
    key: 'SendingPopup'
  }, {
    title: 'Slider Item',
    key: 'SliderItem'
  }, {
    title: 'Golden Loading',
    key: 'GoldenLoading'
  }
]

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  rowItem: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default class TabComponent extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
  }
  render() {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <FlatList
          style={styles.list}
          data={list}
          keyExactor={item => `${item.key}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => this.props.navigation.navigate(item.key)}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}
