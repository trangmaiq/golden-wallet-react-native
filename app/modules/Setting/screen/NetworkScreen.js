import React, { Component } from 'react'
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  SafeAreaView
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import { NavigationActions } from 'react-navigation'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import Images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import Spinner from '../../../components/elements/Spinner'
import LayoutUtils from '../../../commons/LayoutUtils'
import NetworkItem from '../elements/NetworkItem'
import MainStore from '../../../AppStores/MainStore'
import Config from '../../../AppStores/stores/Config'
import constant from '../../../commons/constant'
import NavStore from '../../../stores/NavStore'

const marginTop = LayoutUtils.getExtraTop()
const networks = [
  'mainnet',
  'ropsten',
  'rinkeby',
  'kovan'
]

@observer
export default class NetworkScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  onItemPress = (nw) => {
    MainStore.appState.setConfig(new Config(nw, constant.INFURA_API_KEY))
    MainStore.appState.save()
    NavStore.goBack()
  }

  _renderNetworkItem = ({ item, index }) =>
    (
      <NetworkItem item={item} index={index} onPress={this.onItemPress} />
    )

  _renderNetworkList() {
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
    const introStr = 'Changing network while transactions are pending may cause problems'
    return (
      <View style={{ paddingHorizontal: 40, marginTop: 15 }}>
        <Text style={[styles.textSubtitle, { textAlign: 'center' }]}>
          {introStr}
        </Text>
      </View>
    )
  }

  render() {
    const { navigation } = this.props
    const loading = false
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
  textSubtitle: {
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.secondaryTextColor
  }
})
