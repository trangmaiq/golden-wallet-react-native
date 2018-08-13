import React, { Component } from 'react'
import {
  View,
  FlatList,
  Platform
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import TokenItem from '../elements/TokenItem'
import images from '../../../commons/images'
import Helper from '../../../commons/Helper'
import InformationCard from '../elements/InformationCard'
import AppStyle from '../../../commons/AppStyle'
import LayoutUtils from '../../../commons/LayoutUtils'
import ShimmerTokenItem from '../elements/ShimmerTokenItem'
import MainStore from '../../../AppStores/MainStore'

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class TokenScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.wallet.isFetchingBalance = !this.wallet.isFetchingBalance
    // }, 3000)
  }

  onBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  onRefreshToken = async () => {
    this.wallet.fetchingBalance(true)
  }

  onItemPress = (index) => {
    const { navigation } = this.props
    MainStore.appState.setselectedToken(this.wallet.tokens[index])
    MainStore.goToSendTx()
    MainStore.sendTransaction.changeIsToken(MainStore.appState.selectedToken.symbol !== 'ETH')
    navigation.navigate('TransactionListScreen', {
      tokenAddr: this.wallet.tokens[index].address
    })
  }

  get wallet() {
    return MainStore.appState.selectedWallet
  }

  _renderFooter = (wallet) => {
    const { isFetchingBalance } = wallet
    console.log(isFetchingBalance)
    return <ShimmerTokenItem visible={isFetchingBalance} />
  }

  _renderHeader = (wallet) => {
    const { totalBalanceETH, totalBalanceDollar } = wallet
    return (
      <View style={{ marginBottom: 15 }}>
        <InformationCard
          data={{
            cardItem: this.wallet,
            titleText: 'Estimated Value',
            mainSubTitleText: `${Helper.formatETH(totalBalanceETH.toString(10))} ETH`,
            viceSubTitleText: `$${Helper.formatUSD(totalBalanceDollar.toString(10))}`
          }}
          style={{
            marginTop: 15,
            marginHorizontal: 20
          }}
          titleStyle={{
            color: '#8A8D97',
            fontSize: 18,
            fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular'
          }}
          mainSubTitleStyle={{
            color: '#E4BF43',
            fontSize: 30,
            fontFamily: AppStyle.mainFontBold
          }}
          viceSubTitleStyle={{
            color: '#8A8D97',
            fontSize: 16,
            fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
            marginLeft: 8
          }}
        />
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <TokenItem
        style={{
          backgroundColor: AppStyle.backgroundContentDarkMode,
          paddingLeft: 10,
          paddingRight: 15,
          marginBottom: 15,
          borderRadius: 5
        }}
        indexToken={index}
        onPress={() => this.onItemPress(index)}
      />)
  }

  render() {
    const {
      title,
      tokens,
      refreshing
    } = this.wallet

    return (
      <View style={{ flex: 1 }}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title,
            icon: null,
            button: images.backButton
          }}
          action={this.onBack}
        />
        <FlatList
          style={{
            flex: 1
          }}
          ListHeaderComponent={
            this._renderHeader(this.wallet)
          }
          ListFooterComponent={this._renderFooter(this.wallet)}
          data={tokens}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.symbol}-${index}`}
          refreshing={refreshing}
          onRefresh={this.onRefreshToken}
          renderItem={this.renderItem}
        />
      </View>
    )
  }
}
