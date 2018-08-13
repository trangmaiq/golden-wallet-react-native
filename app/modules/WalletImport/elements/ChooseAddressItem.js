import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { observer } from 'mobx-react/native'
import PropTypes from 'prop-types'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import Helper from '../../../commons/Helper'
import commonStyle from '../../../commons/commonStyles'
import MainStore from '../../../AppStores/MainStore'

const { width } = Dimensions.get('window')

@observer
export default class ChooseAddressItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onItemSelect: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.importMnemonicStore = MainStore.importStore.importMnemonicStore
  }

  componentDidMount() {
    this.wallet && this.wallet.fetchingBalance()
  }

  get wallet() {
    const { index } = this.props
    return this.importMnemonicStore.mnemonicWallets[index]
  }

  _onToogle = () => {
    const {
      onItemSelect
    } = this.props
    onItemSelect(this.wallet)
  }

  render() {
    const {
      index
    } = this.props

    const {
      address,
      totalBalanceETH
    } = this.wallet
    const isSelected = this.importMnemonicStore.selectedWallet
      ? address === this.importMnemonicStore.selectedWallet.address
      : false
    const colorText = isSelected ? { color: AppStyle.mainColor } : { color: AppStyle.mainTextColor }

    return (
      <TouchableOpacity onPress={this._onToogle}>
        <View style={[styles.container, { marginTop: index === 0 ? 10 : 20 }]}>
          <View style={styles.rowStyle}>
            <Image
              source={isSelected ? images.imgChoose : images.imgNotChoose}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styles.address, commonStyle.fontAddress, colorText]}
            >
              {address}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.balance, colorText]}
          >
            {`${Helper.formatETH(totalBalanceETH.toString(10), 4)} ETH`}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
    paddingHorizontal: 20
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  address: {
    fontSize: 16,
    marginLeft: 10,
    maxWidth: width - 186
  },
  balance: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    maxWidth: 100
  }
})
