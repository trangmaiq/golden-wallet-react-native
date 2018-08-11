import React, { Component } from 'react'
import {
  View,
  FlatList
} from 'react-native'
// import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import TokenItem from '../../../components/elements/TokenItem'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import AddressTokenStore from '../../../stores/AddressTokenStore'
import Spinner from '../../../components/elements/Spinner'
import WalletStore from '../../../stores/WalletStore'
import Helper from '../../../commons/Helper'
import sendTransactionStore from '../stores/SendTransactionStore'
import CurrencyStore from '../../../stores/CurrencyStore'

@observer
export default class SelectedCoinScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {

  }

  static defaultProps = {

  }

  componentDidMount() {
    const { address, balanceValue } = WalletStore.selectedWallet
    AddressTokenStore.setupStore(address, balanceValue)
  }

  render() {
    const dataTokens = AddressTokenStore.getTokenAddress
    const {
      tokens = []
    } = dataTokens
    const loading = AddressTokenStore.isLoading
    return (
      <View style={{ flex: 1, paddingTop: 26 }}>
        <NavigationHeader
          style={{}}
          headerItem={{
            title: 'Select Coin',
            icon: null,
            button: images.closeButton
          }}
          action={() => {
            sendTransactionStore.selectedModal && sendTransactionStore.selectedModal.close()
          }}
        />
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={tokens}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <View style={{ marginBottom: 20 }}>
                <TokenItem
                  style={{
                    paddingTop: index === 0 ? 0 : 20,
                    height: 72,
                    marginTop: 0
                  }}
                  styleUp={{ justifyContent: item.numberEther ? 'center' : 'flex-start', marginHorizontal: 20 }}
                  title={item.title}
                  subtitle={item.subtitle}
                  iconEther={item.iconEther}
                  randomColor={item.randomColor}
                  numberEther={item.title == 'ETH' ? Helper.formatETH(item.balance) : Helper.formatCommaNumber(item.balance)}
                  dollaEther={Helper.formatUSD(item.balanceUSD)}
                  onPress={() => {
                    sendTransactionStore.isSendToken = true
                    const wallet = {
                      address: WalletStore.selectedWallet.address,
                      postfix: item.title,
                      balanceCrypto: item.balance || 0,
                      balanceUSD: item.balanceUSD || 0,
                      ratio: (item.balanceUSD / (item.balance == 0 || item.balance == null) ? 1 : item.balance) === 0 ? CurrencyStore.currencyUSD : item.balanceUSD / item.balance
                    }
                    sendTransactionStore.setWallet(wallet)
                    // Change coin to reset data
                    sendTransactionStore.setNumberArray({
                      data: [],
                      subData: [],
                      type: false,
                      isHadPoint: false
                    })
                    sendTransactionStore.setToken(item)
                    sendTransactionStore.selectedModal && sendTransactionStore.selectedModal.close()
                  }}
                />
                <View style={{ height: 1, backgroundColor: '#14192D', marginHorizontal: 15 }} />
              </View>)
          }}
        />
        {loading &&
          <Spinner />
        }
      </View>
    )
  }
}
