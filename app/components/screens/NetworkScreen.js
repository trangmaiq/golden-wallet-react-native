import React, { Component } from 'react'
import {
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  View,
  SafeAreaView
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from './../elements/NavigationHeader'
import Images from './../../commons/images'
import AppStyle from './../../commons/AppStyle'
import WalletStore from '../../stores/WalletStore'
import NetworkStore from '../../stores/NetworkStore'
import StringHandler from '../../Handler/StringHandler'
import Spinner from '../elements/Spinner'
import LayoutUtils from '../../commons/LayoutUtils'

const marginTop = LayoutUtils.getExtraTop()

@observer
export default class NetworkScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  _renderNetworkItem = ({ item, index }) => {
    const {
      name,
      isChoose
    } = item
    const {
      navigation
    } = this.props
    const networkName = StringHandler.toCapitalize(name)
    const borderTopWidth = index === 0 ? 0 : 1
    return (
      <TouchableOpacity onPress={() => {
        NetworkStore.changeNetwork(name, index)
        NetworkStore.setSwitchingNetwork(true)
        WalletStore.fetchBalanceAllWallet(null, () => {
          NetworkStore.setSwitchingNetwork(false)
          navigation.goBack()
        })
      }}
      >
        <View style={[styles.rowSubtitle, { borderTopWidth }]}>
          <Text style={styles.textSubtitle}>{networkName}</Text>
          {isChoose && <Image source={Images.iconCheck} />}
        </View>
      </TouchableOpacity>
    )
  }

  returnData = (isCreateSuccess, index) => {
    if (isCreateSuccess) {
      WalletStore.setSelectedIndex(index)
      WalletStore.cacheListOriginalWallet()
    }
  }

  _renderNetworkList() {
    const networks = NetworkStore.networks.slice()
    return (
      <FlatList
        style={{ flex: 1, marginTop: 30 }}
        data={networks}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        renderItem={this._renderNetworkItem}
      />
    )
  }

  _renderIntroduction() {
    const introStr = ''
    return (
      <View style={{ padding: 20 }}>
        <Text style={[styles.textSubtitle, { textAlign: 'center' }]}>
          {introStr}
        </Text>
      </View>
    )
  }

  render() {
    const { navigation } = this.props
    const loading = NetworkStore.switchingNetwork
    return (
      <SafeAreaView style={styles.container}>
        <NavigationHeader
          style={{ marginTop: 20 + marginTop }}
          headerItem={{
            title: 'Network',
            icon: null,
            button: Images.backButton
          }}
          action={() => {
            navigation.dispatch(NavigationActions.back())
          }}
        />
        {this._renderIntroduction()}
        {this._renderNetworkList()}
        {loading &&
          <Spinner />
        }
      </SafeAreaView >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundDarkMode
  },
  rowSubtitle: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundTextInput,
    borderColor: AppStyle.borderLinesSetting,
    justifyContent: 'space-between'
  },
  textSubtitle: {
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.secondaryTextColor
  }
})
