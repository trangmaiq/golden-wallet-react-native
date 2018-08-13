import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native'
import { observer } from 'mobx-react/native'
import images from '../../commons/images'
/* eslint-disable-next-line */
import GoldenLoading from '../../components/elements/GoldenLoading'
import MainStore from '../../AppStores/MainStore'

const { width, height } = Dimensions.get('window')
const isSmallScreen = height < 569
const dataNumber1 = [
  { number: '1' },
  { number: '2' },
  { number: '3' }
]
const dataNumber2 = [
  { number: '4' },
  { number: '5' },
  { number: '6' }
]
const dataNumber3 = [
  { number: '7' },
  { number: '8' },
  { number: '9' }
]
const dataNumber4 = [
  {
    actions: 'cancel'
  },
  { number: '0' },
  {
    icon: images.imgDeletePin,
    actions: 'delete'
  }
]

@observer
export default class UnlockScreen extends Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.isShake = false
  }

  componentDidMount() {
    // setTimeout(() => StatusBar.setHidden(true), 2000)
    // setTimeout(() => StatusBar.setHidden(false), 5000)
  }

  renderDots(numberOfDots) {
    const dots = []
    const { unlock } = MainStore
    const { pinTyped } = unlock.data
    const styleDot = {
      width: 13,
      height: 13,
      borderRadius: 6.5,
      borderWidth: 1,
      borderColor: 'white',
      marginHorizontal: 12
    }
    for (let i = 0; i < numberOfDots; i++) {
      const backgroundColor = i < pinTyped ? { backgroundColor: 'white' } : {}
      const dot = <View style={[styleDot, backgroundColor]} key={i} />
      dots.push(dot)
    }
    return dots
  }

  renderNumber(arrayNumber) {
    const { unlock } = MainStore
    const nums = arrayNumber.map((num, i) => {
      if (num.number) {
        return (
          <TouchableOpacity
            onPress={() => {
              unlock.handlePress(num.number)
            }}
            key={num.number}
          >
            <View style={styles.numberField}>
              <Text style={styles.numberText}>{num.number}</Text>
            </View>
          </TouchableOpacity>
        )
      }

      return (
        <TouchableOpacity
          key={num.actions}
          onPress={() => {
            if (num.actions === 'delete') {
              unlock.handleDeletePin()
            }
          }}
        >
          <View style={styles.numberField}>
            {num.actions !== 'cancel' &&
              <Image
                source={num.icon}
              />
            }
            {num.actions === 'cancel' &&
              <Text style={styles.cancelText}>Cancel</Text>
            }
          </View>
        </TouchableOpacity>
      )
    })

    return (
      <View style={styles.arrayNumber}>
        {nums}
      </View>
    )
  }

  render() {
    const { unlock } = MainStore
    const unlockDescription = unlock.data.unlockDes
    const animationShake = unlock.animatedValue.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [0, -20, 20, 0],
      useNativeDriver: true
    })

    return (
      <View style={styles.container}>
        <StatusBar
          hidden
        />
        <GoldenLoading
          style={{ marginTop: isSmallScreen ? 10 : height * 0.07 }}
          isSpin={false}
        />
        <Text style={styles.desText}>{unlockDescription}</Text>
        <Animated.View
          style={[styles.pinField, {
            transform: [
              {
                translateX: animationShake
              }
            ]
          }]}
        >
          {this.renderDots(6)}
        </Animated.View>
        <View style={{ marginTop: isSmallScreen ? 10 : height * 0.03 }}>
          {this.renderNumber(dataNumber1)}
          {this.renderNumber(dataNumber2)}
          {this.renderNumber(dataNumber3)}
          {this.renderNumber(dataNumber4)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width
  },
  desText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : 22,
    fontFamily: 'OpenSans-Bold',
    marginTop: isSmallScreen ? 10 : height * 0.03
  },
  pinField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isSmallScreen ? 13 : height * 0.05
  },
  arrayNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02
  },
  numberField: {
    width: isSmallScreen ? 60 : 75,
    height: isSmallScreen ? 60 : 75,
    borderRadius: 37.5,
    // backgroundColor: AppStyle.colorPinCode,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 13
  },
  numberText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 36,
    color: 'white'
  },
  cancelText: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 20,
    color: 'white'
  }
})
