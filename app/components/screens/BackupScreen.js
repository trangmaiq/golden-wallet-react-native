import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import lodash from 'lodash'
import Swiper from 'react-native-swiper'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import BackupWalletScreen from './BackupWalletScreen'
import BackupChooseKeywordScreen from './BackupChooseKeywordScreen'
import BackupChooseSuccessCreen from './BackupChooseSuccesScreen'
import AppStyle from '../../commons/AppStyle'
import WalletStore from '../../stores/WalletStore'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'

const { height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()
export default class BackupScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  constructor(props) {
    super(props)
    const { mnemonic } = WalletStore
    this.arrayMnemonic = mnemonic.split(' ').map(String)
    this.currentIndex = 0
  }

  resetMnemonicView() {
    const { arrayMnemonic } = this
    this.chooseMnemonicScreen.setState({
      listKeywordRandom: lodash.shuffle(arrayMnemonic),
      listKeyWordChoose: arrayMnemonic.map(str => ''),
      buttonStates: arrayMnemonic.map(str => true)
    })
  }

  render() {
    const { currentIndex } = this
    return (
      <View style={{ flex: 1, backgroundColor: AppStyle.backgroundDarkMode }}>
        <NavigationHeader
          style={{ marginTop: marginTop + 20 }}
          headerItem={{
            title: null,
            icon: null,
            button: images.backButton
          }}
          action={() => {
            if (currentIndex === 0) {
              NavigationStore.popView()
            } else {
              this.swiper.scrollBy(-1, true)
            }
          }}
        />
        <Swiper
          ref={(ref) => { this.swiper = ref }}
          loop={false}
          onIndexChanged={(index) => {
            this.currentIndex = index
            if (index === 1) {
              this.resetMnemonicView()
            }
          }}
          paginationStyle={{ marginBottom: 0.06 * height }}
          dotColor="white"
          activeDotColor={AppStyle.mainColor}
        >
          <BackupWalletScreen />
          <BackupChooseSuccessCreen
            arrayMnemonic={this.arrayMnemonic}
          />
          <BackupChooseKeywordScreen
            ref={(ref) => { this.chooseMnemonicScreen = ref }}
            arrayMnemonic={this.arrayMnemonic}
          />
        </Swiper>
      </View>
    )
  }
}
