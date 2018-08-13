import React, { Component } from 'react'
import { View, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import BackupFirstStep from '../elements/BackupFirstStep'
import BackupSecondStep from '../elements/BackupSecondStep'
import BackupThidStep from '../elements/BackupThirdStep'
import LayoutUtils from '../../../commons/LayoutUtils'
import AppStyle from '../../../commons/AppStyle'
import images from '../../../commons/images'
import MainStore from '../../../AppStores/MainStore'
import NavStore from '../../../stores/NavStore'

const { height } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

export default class BackupScreen extends Component {
  constructor(props) {
    super(props)
    this.currentIndex = 0
  }

  render() {
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
            if (this.currentIndex === 0) {
              NavStore.goBack()
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
              MainStore.backupStore.setup()
            }
          }}
          paginationStyle={{ marginBottom: 0.06 * height }}
          dotColor="white"
          activeDotColor={AppStyle.mainColor}
        >
          <BackupFirstStep />
          <BackupSecondStep />
          <BackupThidStep />
        </Swiper>
      </View>
    )
  }
}
