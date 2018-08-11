import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import SmallCard from '../elements/SmallCard'
import AppStyle from '../../commons/AppStyle'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()
const { width } = Dimensions.get('window')

@observer
export default class CreateWalletScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    index: PropTypes.number,
    returnData: PropTypes.func,
    navigator: PropTypes.object
  }

  static defaultProps = {
    index: 0,
    returnData: () => { },
    navigator: {}
  }

  componentWillMount() {
    const {
      navigator
    } = this.props
    NavigationStore.navigations.push(navigator)
    NavigationStore.navigation = navigator
  }

  render() {
    const { index, returnData } = this.props
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: constant.CREATE_NEW_WALLET,
            icon: null,
            button: images.closeButton
          }}
          action={() => {
            NavigationStore.dismissView()
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SmallCard
            title="Create"
            subtitle="a new wallet"
            imageCard={images.imgCardCreate}
            onPress={() => {
              NavigationStore.navigateTo(ScreenID.EnterNameScreen, {
                returnData: () => {
                  returnData(true, index, true)
                  NavigationStore.dismissView()
                }
              })
            }}
            imageBackground="backgroundCard"
            titleTextStyle={{ color: AppStyle.mainColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />

          <SmallCard
            style={{ marginTop: 40 }}
            title="Import"
            subtitle="existing wallet"
            imageCard={images.imgCardImport}
            onPress={() => {
              NavigationStore.navigateTo(ScreenID.ImportWalletScreen, {
                index,
                returnData: (isAddress = false) => {
                  returnData(true, index, false, isAddress)
                  NavigationStore.dismissView()
                }
              })
            }}
            imgBackground="backgroundCard"
            imgBackgroundStyle={{ height: 214, borderRadius: 14, width: width - 40 }}
            titleTextStyle={{ color: AppStyle.mainTextColor }}
            subtitleTextStyle={{ color: AppStyle.secondaryTextColor, marginTop: 4, fontSize: 16 }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
