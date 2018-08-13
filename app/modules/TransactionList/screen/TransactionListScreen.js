import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import TransactionItem from '../elements/TransactionItem'
import Spinner from '../../../components/elements/Spinner'
import LayoutUtils from '../../../commons/LayoutUtils'
import TransactionDetail from '../../TransactionDetail/screen/TransactionDetailScreen'
import Modal from '../../../../Libs/react-native-modalbox'

import EmptyList from '../elements/EmptyList'
import AppState from '../../../AppStores/AppState'

const marginTop = LayoutUtils.getExtraTop()
const { width, height } = Dimensions.get('window')

@observer
export default class TransactionListScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  state = {}

  componentDidMount() {
    this.selectedToken.fetchTransactions(false)
  }

  onPressTxItem = (item) => {
    this.selectedToken.setSelectedTransaction(item)
    this.transactionDetail.open()
  }

  onRefresh = async () => {
    this.selectedToken.fetchTransactions(true)
  }

  onEndReached = async () => {
    this.selectedToken.fetchTransactions(false)
  }

  get selectedToken() {
    return AppState.selectedToken
  }

  _renderEmptyList = () => {
    if (!this.selectedToken.isLoading && !this.selectedToken.isRefreshing &&
      this.selectedToken.transactions.length === 0) {
      return <EmptyList />
    }

    return <View />
  }

  render() {
    const transactions = this.selectedToken.allTransactions
    const { navigation } = this.props
    const { isRefreshing } = this.selectedToken

    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: 'Transactions',
            icon: null,
            button: images.backButton
          }}
          action={() => {
            navigation && navigation.goBack()
          }}
        />
        <FlatList
          style={{ width }}
          data={transactions}
          ListEmptyComponent={this._renderEmptyList()}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.hash}-${item.from}-${index}`}
          refreshing={isRefreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={30}
          renderItem={({ item, index }) => (
            <TransactionItem
              index={index}
              transactionItem={item}
              action={() => { this.onPressTxItem(item) }}
            />
          )}
        />
        <Modal
          style={{
            zIndex: 200,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden',
            height: height - marginTop - 68
          }}
          position="bottom"
          swipeToClose
          onClosed={() => {

          }}
          ref={(ref) => { this.transactionDetail = ref }}
        >
          <View style={{ height: height - marginTop - 68 }}>
            <View
              style={{
                alignSelf: 'center',
                height: 3,
                width: 45,
                borderRadius: 1.5,
                backgroundColor: AppStyle.secondaryTextColor,
                position: 'absolute',
                zIndex: 30,
                top: 10
              }}
            />
            <TransactionDetail
              onClose={() => { this.transactionDetail.close() }}
              onCheck={(txHash) => { navigation.navigate('TxHashWebViewScreen', { txHash }) }}
            />
          </View>
        </Modal>
        {transactions.length === 0 && <Spinner />}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundColor,
    flex: 1
  }
})
