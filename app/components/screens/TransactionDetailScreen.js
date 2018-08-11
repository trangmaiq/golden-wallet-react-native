import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import Modal from 'react-native-modalbox'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import TransactionItem from '../elements/TransactionsItem'
import TransactionDetailInfoScreen from './TransactionDetailInfo'
import ReceiveScreen from './ReceiveScreen'
import TransactionStore from '../../stores/TransactionStore'
import Spinner from '../elements/Spinner'
import LayoutUtils from '../../commons/LayoutUtils'
import TransactionDetailAPI from '../../api/TransactionDetailAPI'
import NotificationStore from '../../stores/NotificationStore'
import WalletStore from '../../stores/WalletStore'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'
import Starypto from '../../../Libs/react-native-starypto'
import Helper from '../../commons/Helper'

const marginTop = LayoutUtils.getExtraTop()
const extraBottom = LayoutUtils.getExtraBottom()
const { width, height } = Dimensions.get('window')

@observer
export default class TransactionDetail extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    address: PropTypes.string,
    addressToken: PropTypes.string,
    name: PropTypes.string,
    dataToken: PropTypes.object,
    tx: PropTypes.object
  }

  static defaultProps = {
    address: '',
    addressToken: '',
    name: '',
    dataToken: {
      balance: 0,
      balanceUSD: 0,
      title: ''
    },
    tx: null
  }

  constructor(props) {
    super(props)
    TransactionStore.clearTransactionMap()
    const {
      address = '',
      addressToken = '',
      name = '',
      dataToken = {
        balance: 0,
        balanceUSD: 0,
        title: ''
      }
    } = this.props
    // const {
    //   balance,
    //   balanceUSD
    // } = dataToken
    this.address = address
    this.addressToken = addressToken
    this.state = {
      nameWallet: name,
      transactionInfo: [],
      tokenInfo: {
        name: '',
        symbol: dataToken.title,
        decimals: 1,
        price: {
          rate: 0,
          currency: 'USD'
        }
      }
    }

    if (dataToken.title === '') {
      const selectedTokenKey = addressToken === 'eth' ? address : `${address} - ${addressToken}`
      TransactionStore.setSelectedToken(selectedTokenKey.toLowerCase())
      TransactionDetailAPI.getBalanceToken(address, addressToken).then((res) => {
        const { data } = res.data
        const { tokenInfo } = data
        this.setState({
          tokenInfo
        })
        setTimeout(() => {
          this.fetchData(false, tokenInfo)
        }, 300)
      }).catch((_) => {
        // console.log(error)
      })
    } else {
      setTimeout(() => {
        this.fetchData()
      }, 300)
    }
  }

  componentWillMount() {
    const { tx } = this.props

    if (tx) {
      this.state.transactionInfo = this.parseListTransactionInfoFromNotification(tx)
    }
  }

  componentDidMount() {
    const { tx } = this.props
    if (tx) {
      setTimeout(() => {
        this.transactionInfoModal.open()
      }, 300)
    }
    setTimeout(() => {
      if (NotificationStore.isInitFromNotification) {
        NavigationStore.showModal(ScreenID.UnlockScreen, {}, true)
        NotificationStore.isInitFromNotification = false
        NotificationStore.transactionFromNotif = {}
      }
    }, 0)
  }

  async fetchData(isRefresh = false, tokenInfo = this.state.tokenInfo) {
    const {
      address,
      addressToken
    } = this
    const { dataToken = { title: '' } } = this.props
    await TransactionStore.removePendingTransactionIfDone(addressToken.toLowerCase())
    if (address === addressToken || addressToken === 'eth') {
      TransactionStore.getTransactionAPI(tokenInfo, isRefresh, address.toLowerCase())
    } else {
      TransactionStore.getTransactionAPI(tokenInfo, isRefresh, address.toLowerCase(), {
        module: 'account',
        action: 'tokentx',
        address,
        sort: 'desc',
        contractaddress: addressToken,
        offset: 8,
        symbol: dataToken.title
      })
    }
  }

  _checkAddressExist() {
    const { address } = this
    if (!WalletStore.dataCards || WalletStore.dataCards.length === 0) { return false }
    const wallets = WalletStore.dataCards
    return wallets.filter((wallet) => {
      return wallet.address === address
    }).length > 0
  }

  _renderEmptyTransaction = () => {
    const tx = TransactionStore.walletTransactions
    if (!tx) {
      return <View />
    }
    return (
      <View style={styles.emptyTransactionContainer}>
        <Image
          style={{ marginTop: 20, height: height * 0.28 }}
          resizeMode="contain"
          source={images.imgEmptyTransaction}
        />
        <Text style={styles.titleEmptyTransaction}>Nothing here</Text>
        <Text style={styles.subtitleEmptyTransaction}>You don’t have any transactions.</Text>
      </View>
    )
  }

  _renderHeaderTransaction = () => {
    return (
      <View style={{ width }} />
    )
  }

  parseListTransactionInfoFromNotification(transaction) {
    const JSONTransaction = JSON.parse(transaction)
    const {
      from,
      to,
      gas,
      gasPrice,
      hash,
      symbol,
      timestamp,
      value,
      type
    } = JSONTransaction

    const dateStr = Helper.formatTransactionDate(timestamp)
    const isSend = type === constant.SENT

    const gasNumber = Number(gas)
    const gasPriceNumber = Number(gasPrice)
    const fee = Starypto.Units.formatUnits(`${gasNumber * gasPriceNumber}`, 18)
    const dataTransactionInfo = [
      {
        title: 'Value',
        type,
        subtitle: `${isSend ? '-' : '+'} ${value} ${symbol}`
      },
      {
        title: 'Time',
        subtitle: dateStr
      },
      {
        title: 'Transaction Hash',
        subtitle: hash
      },
      {
        title: isSend ? 'To' : 'From',
        subtitle: isSend ? to : from
      },
      {
        title: 'Fee',
        subtitle: `${fee} ${symbol}`
      }
    ]
    return dataTransactionInfo
  }

  parseListTransactionInfo(transaction) {
    const isSend = transaction.type === constant.SENT
    const dataTransactionInfo = [
      {
        title: 'Value',
        type: transaction.type,
        subtitle: transaction.balance
      },
      {
        title: 'Time',
        subtitle: transaction.date
      },
      {
        title: 'Transaction Hash',
        subtitle: transaction.hash
      },
      {
        title: isSend ? 'To' : 'From',
        subtitle: isSend ? transaction.to : transaction.from
      },
      {
        title: 'Fee',
        subtitle: transaction.fee
      }
    ]
    return dataTransactionInfo
  }

  render() {
    const { address } = this
    const {
      nameWallet,
      tokenInfo
    } = this.state
    let {
      symbol = 'ETH'
    } = tokenInfo
    if (!symbol) {
      symbol = 'ETH'
    }
    const transactions = TransactionStore.walletTransactions
    const refreshing = TransactionStore.isRefreshing
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
            NavigationStore.popView()
          }}
        />
        <FlatList
          data={transactions}
          ListHeaderComponent={this._renderHeaderTransaction}
          ListEmptyComponent={this._renderEmptyTransaction}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          refreshing={refreshing}
          onRefresh={async () => {
            TransactionStore.setRefreshing(true)
            await this.fetchData(true)
          }}
          onEndReached={async () => {
            await this.fetchData()
          }}
          renderItem={({ item, index }) => {
            return (
              <TransactionItem
                index={index}
                transactionItem={item}
                action={() => {
                  this.setState({
                    transactionInfo: this.parseListTransactionInfo(item)
                  }, () => {
                    this.transactionInfoModal.open()
                  })
                }}
              />
            )
          }}
        />
        <Modal
          style={{
            height: height - 10 - getStatusBarHeight() + extraBottom,
            zIndex: 200,
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden'
          }}
          swipeToClose
          onClosed={() => {

          }}
          ref={(ref) => { this.transactionInfoModal = ref }}
        >
          <View style={{ height: height - 10 - getStatusBarHeight() + extraBottom }}>
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
            <TransactionDetailInfoScreen
              onClose={() => { this.transactionInfoModal.close() }}
              dataTransactionInfo={this.state.transactionInfo}
            />
          </View>
        </Modal>
        <Modal
          style={{
            height: height - 10 - getStatusBarHeight(),
            zIndex: 200,
            position: 'absolute',
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden'
          }}
          swipeToClose
          onClosed={() => {

          }}
          ref={(ref) => { this.receiveModal2 = ref }}
        >
          <View style={{ height: height - 10 - getStatusBarHeight() }}>
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
            <ReceiveScreen
              onClose={() => { this.receiveModal2.close() }}
              popupHeight={height - 38 - marginTop}
              address={address}
              name={nameWallet}
            />
          </View>
        </Modal>
        {!transactions &&
          <Spinner />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: AppStyle.Align.center,
    flex: 1
  },
  emptyTransactionContainer: {
    flex: 1,
    alignItems: AppStyle.Align.center
  },
  titleEmptyTransaction: {
    fontSize: 18,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.mainTextColor,
    marginTop: 20
  },
  subtitleEmptyTransaction: {
    fontSize: 16,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.secondaryTextColor,
    marginTop: 10
  }
})
