import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet
} from 'react-native'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'

const { height } = Dimensions.get('window')

export default class EmptyList extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ marginTop: 20, height: height * 0.28 }}
          resizeMode="contain"
          source={images.imgEmptyTransaction}
        />
        <Text style={styles.titleEmptyTransaction}>Nothing here</Text>
        <Text style={styles.subtitleEmptyTransaction}>You don’t have any transactions.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  titleEmptyTransaction: {
    fontSize: 18,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor,
    marginTop: 20
  },
  subtitleEmptyTransaction: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.secondaryTextColor,
    marginTop: 10
  }
})