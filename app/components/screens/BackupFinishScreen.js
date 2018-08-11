import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'
import HapticHandler from '../../Handler/HapticHandler'
import NavigationStore from '../../navigation/NavigationStore'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812

export default class CreateWalletScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  componentDidMount() {
    HapticHandler.NotificationSuccess()
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={images.imgLock}
        />
        <Text
          style={styles.textDes}
        >
          Remember to keep your Mnemonic
          phrase in a safe place. You will need it to
          restore your wallet. Be your own bank
          and take security seriously.
        </Text>
        <View style={{ position: 'absolute', left: 20, bottom: isIPX ? 40 : 20 }}>
          <TouchableOpacity
            style={styles.buttonGotIt}
            onPress={() => {
              NavigationStore.popToRootView()
            }}
          >
            <Text style={styles.textGotIt}>
              {constant.GOT_IT}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  textDes: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.secondaryTextColor,
    paddingHorizontal: 30,
    textAlign: 'center',
    marginBottom: 50
  },
  buttonGotIt: {
    width: width - 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#121734'
  },
  textGotIt: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18,
    color: AppStyle.mainColor
  }
})
