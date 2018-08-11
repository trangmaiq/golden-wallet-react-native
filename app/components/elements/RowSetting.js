import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import PropTypes from 'prop-types'
import AppStyle from '../../commons/AppStyle'
import ManageWalletItem from './ManageWalletItem'
import images from '../../commons/images'

const rowHeight = Platform.OS === 'ios' ? 78.5 : 89.1
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

export default class RowSetting extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  state = {
    extraHeight: new Animated.Value(0),
    isShow: false
  }

  _startAnimation(value) {
    Animated.timing(
      this.state.extraHeight,
      {
        toValue: this.state.isShow ? value : 0,
        duration: 250
      }
    ).start()
  }

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props
    return (
      <ManageWalletItem
        wallet={item}
        action={() => {
          navigation.navigate('EditYourWalletScreen', {
            wallet: item,
            index
          })
        }}
      />
    )
  }

  _renderFooter = () => {
    const textButton = this.props.item.title === 'Manage your wallet' ? 'Add new Wallet' : 'Add new Contact'

    return (
      <TouchableOpacity>
        <View style={styles.footerField}>
          <Image
            style={{
              tintColor: AppStyle.mainColor
            }}
            source={images.iconAdd}
          />
          <Text style={styles.addWallet}>{textButton}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { item } = this.props
    const { onPress, data, title } = item
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (data) {
            this.setState({
              isShow: !this.state.isShow
            }, () => {
              this.itemCount = data.length
              this._startAnimation(rowHeight * data.length + 44)
            })
          } else {
            onPress()
          }
        }}
      >
        <View style={styles.container}>
          <Text style={styles.titleStyle}>{title}</Text>
          {data &&
            <AnimatedFlatList
              style={{ height: this.state.extraHeight }}
              data={data}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `${index}`}
              renderItem={this._renderItem}
              scrollEnabled={false}
              ListFooterComponent={this._renderFooter}
            />
          }
          <View style={styles.line} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  titleStyle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Semibold',
    color: AppStyle.mainTextColor
  },
  line: {
    height: 1,
    backgroundColor: AppStyle.colorLines,
    marginTop: 20
  },
  footerField: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addWallet: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
    color: AppStyle.mainColor,
    marginLeft: 14
  }
})
