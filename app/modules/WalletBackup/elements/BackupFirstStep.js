import React, { Component } from 'react'
import {
  View,
  Dimensions,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const backupDes = 'Your private key is use to restore your wallet and send your assets. Anyone with your private key can restore and spend your assets. There is no way to recover your private key if it is forgotten.'

export default class BackupFirstStep extends Component {
  render() {
    const heightImage = isSmallScreen ? { height: height * 0.3 } : {}
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            source={images.imageBackUp}
            style={[styles.imageBackUp, heightImage]}
          />
          <Text style={styles.subTitle}>
            {backupDes}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25
  },
  imageBackUp: {
    alignSelf: 'center',
    marginTop: 20
  },
  subTitle: {
    color: AppStyle.secondaryTextColor,
    fontSize: width >= 375 ? 18 : 14,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    marginTop: height * 0.1,
    textAlign: 'center'
  }
})
