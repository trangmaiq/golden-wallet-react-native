import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import SmallCard from '../elements/SmallCard'
import AppStyle from '../../commons/AppStyle'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const marginTop = LayoutUtils.getExtraTop()

export default class ImportWalletScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    index: PropTypes.number,
    returnData: PropTypes.func
  }

  static defaultProps = {
    index: 0,
    returnData: () => {}
  }

  render() {
    const { index, returnData } = this.props
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: constant.ETHEREUM,
            icon: images.iconETH,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popView()
          }}
        />
        <ScrollView>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <SmallCard
              style={{ height: 174, marginTop: 20 }}
              title="Private Key"
              subtitle="Golden will import your private key to unlock your wallet. We recommened that you back up the private key and save it in safe place for later recovery of your wallet."
              imageCard={images.iconPrivateKey}
              onPress={() => {
                NavigationStore.navigateTo(ScreenID.ImportViaPrivateKeyScreen, {
                  returnData: () => {
                    returnData()
                  }
                })
              }}
              imageBackground="backgroundCard"
              imageBackgroundStyle={{ height: 174 }}
              titleTextStyle={{ color: AppStyle.mainColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />

            <SmallCard
              style={{ height: 174, marginTop: 20 }}
              title="Mnemonic"
              subtitle="Golden import your Mnemonic phrase to recovery your wallet."
              imageCard={images.iconMnemonic}
              onPress={() => {
                NavigationStore.navigateTo(ScreenID.ImportViaMnemonicScreen, {
                  returnData: () => { returnData() }
                })
              }}
              titleTextStyle={{ color: AppStyle.mainTextColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />

            <SmallCard
              style={{ marginTop: 20, marginBottom: 20, height: 174 }}
              title="Address"
              subtitle="Enter wallet address, you can check the balance and receive tokens, but cannot send token out. Therefore, your assetss will be absolutely safe."
              imageCard={images.iconAddress}
              onPress={() => {
                NavigationStore.navigateTo(ScreenID.ImportViaAddressScreen, {
                  index,
                  returnData: () => {
                    returnData(true)
                  }
                })
              }}
              titleTextStyle={{ color: AppStyle.mainTextColor }}
              subtitleTextStyle={{
                color: AppStyle.secondaryTextColor, marginTop: 10
              }}
            />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
