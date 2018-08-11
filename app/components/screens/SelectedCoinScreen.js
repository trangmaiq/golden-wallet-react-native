import React, { Component } from 'react'
import {
  View,
  FlatList
} from 'react-native'
import PropsType from 'prop-types'
import { observer } from 'mobx-react/native'
import TokenItem from '../elements/TokenItem'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import AddressTokenStore from '../../stores/AddressTokenStore'
import Spinner from '../elements/Spinner'

@observer
export default class SelectedCoinScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }

  componentDidMount() {
    const { navigation } = this.props
    const { address } = navigation.state.params
    AddressTokenStore.setupStore(address)
  }

  render() {
    const dataTokens = AddressTokenStore.getTokenAddress
    const { navigation } = this.props
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
            button: images.backButton
          }}
          action={() => this.props.navigation.goBack()}
        />
        <FlatList
          style={{ flex: 1, marginTop: 10 }}
          data={tokens}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <TokenItem
                style={{ paddingTop: index === 0 ? 0 : 20 }}
                styleUp={{ justifyContent: item.numberEther ? 'center' : 'flex-start', marginHorizontal: 20 }}
                title={item.title}
                subtitle={item.subtitle}
                iconEther={item.iconEther}
                randomColor={item.randomColor}
                onPress={() => {
                  navigation.state.params.returnData(item)
                  navigation.goBack()
                }}
              />)
          }}
        />
        {loading &&
          <Spinner />
        }
      </View>
    )
  }
}
