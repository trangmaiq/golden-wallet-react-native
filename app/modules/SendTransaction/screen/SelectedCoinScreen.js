import React, { Component } from 'react'
import {
  View,
  FlatList,
  StyleSheet
} from 'react-native'
import { observer } from 'mobx-react/native'
import TokenItem from '../elements/TokenItems'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import images from '../../../commons/images'
import Spinner from '../../../components/elements/Spinner'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class SelectedCoinScreen extends Component {
  onItemPress = (index) => {
    const { appState, sendTransaction } = MainStore
    const amountText = {
      data: [],
      subData: [],
      isUSD: false,
      isHadPoint: false
    }
    appState.setselectedToken(this.wallet.tokens[index])
    sendTransaction.changeIsToken(MainStore.appState.selectedToken.symbol !== 'ETH')
    sendTransaction.amountStore.selectedCoinModal &&
      sendTransaction.amountStore.selectedCoinModal.close()
    sendTransaction.amountStore.setAmountText(amountText)
  }

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  render() {
    const { tokens } = this.wallet
    const loading = false
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
            MainStore.sendTransaction.amountStore.selectedCoinModal &&
              MainStore.sendTransaction.amountStore.selectedCoinModal.close()
          }}
        />
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={tokens}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.symbol}`}
          renderItem={({ item, index }) => {
            return (
              <View style={{ marginBottom: 20 }}>
                <TokenItem
                  style={{ paddingTop: 0, height: 72, marginTop: 0 }}
                  styleUp={{ justifyContent: item.numberEther ? 'center' : 'flex-start', marginHorizontal: 20 }}
                  indexToken={index}
                  onPress={() => this.onItemPress(index)}
                />
                <View style={styles.lineStyle} />
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

const styles = StyleSheet.create({
  lineStyle: {
    height: 1,
    backgroundColor: '#14192D',
    marginHorizontal: 15
  }
})
