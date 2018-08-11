import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import TagList from '../elements/TagList'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const imageScreenShotSize = width >= 375 ? 51 : 41
export default class BackupChooseSuccessScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }
  
  static propTypes = {
    arrayMnemonic: PropTypes.array.isRequired
  }

  renderButtonMnemonic = (text, style) => {
    return (
      <View style={[styles.button, style]}>
        <Text style={styles.textButton}>
          {text}
        </Text>
      </View>
    )
  }
  renderLineButonMnemonic = (text1, text2, text3) => {
    return (
      <View style={styles.lineMnemonic}>
        {this.renderButtonMnemonic(text1)}
        {this.renderButtonMnemonic(text2, { marginLeft: 17 })}
        {this.renderButtonMnemonic(text3, { marginLeft: 17 })}
      </View>
    )
  }

  render() {
    const { arrayMnemonic } = this.props
    return (
      <View style={styles.container}>
        {/* <Text style={styles.titleTop}>
          Verify your Mnemonic phrases.
        </Text> */}
        <Text style={[styles.titleTop, { marginBottom: 10 }]}>
          We recommend that you write down your mnemonic phrase on
          a piece of paper and keep it in a safe place.
        </Text>
        <TagList
          isShowOrder
          arrayMnemonic={arrayMnemonic}
          style={{
            paddingVerticalOfItem: isSmallScreen ? 12 : 20,
            numberOfWordInRow: 3,
            margin: 20,
            backgroundColor: AppStyle.backgroundContentDarkMode,
            itemBackgroundColor: AppStyle.backgroundContentDarkMode,
            itemTextColor: '#8A8D97',
            fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
            fontWeight: '500',
            itemFontSize: isSmallScreen ? 12 : 14,
            userInteractionEnabled: false
          }}
        />
        <View style={styles.viewBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              Do not take screenshot.
            </Text>
          </View>
          <Image
            source={images.imageNoScreenShot}
            style={styles.imageCamera}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F24'
  },
  titleTop: {
    fontSize: isSmallScreen ? 16 : 18,
    marginHorizontal: 20,
    color: 'white',
    fontFamily: 'OpenSans-Bold'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: 90,
    height: 30
  },
  textButton: {
    color: AppStyle.dollaEtherColor,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular'
  },
  viewBottom: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 30,
    flex: 1,
    marginBottom: 20
  },
  lineMnemonic: {
    alignSelf: 'center',
    flexDirection: 'row'
  },
  imageCamera: {
    alignSelf: 'center',
    width: imageScreenShotSize,
    height: imageScreenShotSize,
    marginLeft: 20
  },
  title: {
    fontSize: isSmallScreen ? 16 : 20,
    fontFamily: 'OpenSans-Bold',
    color: AppStyle.titleDarkModeColor
  }
})
