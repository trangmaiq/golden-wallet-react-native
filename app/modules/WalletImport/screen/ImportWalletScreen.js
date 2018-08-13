import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import SmallCard from '../../../components/elements/SmallCard'
import LayoutUtils from '../../../commons/LayoutUtils'
import constant from '../../../commons/constant'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'

const marginTop = LayoutUtils.getExtraTop()

export default class ImportWalletScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  gotoImportAddress = () => {
    const { navigation } = this.props
    navigation.navigate('ImportViaAddressScreen')
  }

  gotoImportPrivateKey = () => {
    const { navigation } = this.props
    navigation.navigate('ImportViaPrivateKeyScreen')
  }

  gotoImportMnemonic = () => {
    const { navigation } = this.props
    navigation.navigate('ImportViaMnemonicScreen')
  }

  goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: constant.ETHEREUM,
            icon: images.iconETH,
            button: images.backButton
          }}
          action={this.goBack}
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
              onPress={this.gotoImportPrivateKey}
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
              onPress={this.gotoImportMnemonic}
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
              onPress={this.gotoImportAddress}
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
