import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  // Dimensions,
  Animated,
  FlatList,
  Easing,
  Image,
  View,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from './../../commons/AppStyle'
import Helper from '../../commons/Helper'

const marginLeftOfItem = 2
const widthOfItem = 100

export default class Ticker extends Component {
  static propTypes = {
    data: PropTypes.array
  }

  static defaultProps = {
    data: []
  }

  constructor(props) {
    super(props)

    this.scrolling = this.scrolling.bind(this)
    this.state = {
      scrollDistance: new Animated.Value(0)
    }
    this.currentPosition = 0
  }

  componentDidUpdate(prevProps, preState) {
    if (this.props.data.length !== prevProps.data.length) {
      this.scrolling()
    }
  }

  scrolling() {
    this.currentPosition -= ((widthOfItem + marginLeftOfItem) * (this.props.data.length))
    Animated.loop(Animated.timing(
      this.state.scrollDistance,
      {
        toValue: this.currentPosition,
        easing: Easing.linear,
        duration: 20000,
        useNativeDriver: true
      }
    )).start()
  }

  _renderItem = ({ item }) => {
    const {
      balance,
      increase,
      symbol
    } = item
    return (
      <View style={styles.itemStyle}>
        <Image
          source={{ uri: Helper.getIconCoin(symbol) }}
          style={styles.iconStyle}
        />
        <Text style={[styles.textStyle, { color: increase ? '#7ED321' : '#E50370' }]}>{`$${balance}`}</Text>
      </View>
    )
  }

  render() {
    const { scrollDistance } = this.state
    const { data } = this.props
    const showData = [...data, ...data]
    return (
      <View style={styles.container}>
        <Animated.View style={[
          styles.animaionViewStyle,
          {
            transform: [
              { translateX: scrollDistance }
            ],
            width: 5000
          }
        ]}
        >
          <FlatList
            scrollEnabled={false}
            data={showData}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={(_, index) => `${index}`}
            renderItem={this._renderItem}
          />
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  animaionViewStyle: {
    flexDirection: 'row'
  },
  textStyle: {
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    fontSize: 16,
    color: AppStyle.mainColor
  },
  itemStyle: {
    marginLeft: marginLeftOfItem,
    flexDirection: 'row',
    width: widthOfItem,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 8
  }
})
