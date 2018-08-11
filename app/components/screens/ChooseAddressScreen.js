import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList
} from 'react-native'

import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import constant from '../../commons/constant'
import images from '../../commons/images'
import AppStyle from '../../commons/AppStyle'
import ActionButton from '../elements/ActionButton'
import ChooseAddressItem from '../elements/ChooseAddressItem'
import ImportWalletStore from '../../stores/ImportWalletStore'
import WalletStore from '../../stores/WalletStore'
import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'

const marginTop = LayoutUtils.getExtraTop()
const extraBottom = LayoutUtils.getExtraBottom()
const { width } = Dimensions.get('window')

@observer
export default class ChooseAddressScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    returnData: PropTypes.func
  }

  static defaultProps = {
    returnData: () => { }
  }

  render() {
    const data = ImportWalletStore.listWalletViaMnemonic
    const { returnData } = this.props
    return (
      <View
        style={[styles.container]}
      >
        <NavigationHeader
          style={{ marginTop: marginTop + 20, width }}
          headerItem={{
            title: null,
            icon: null,
            button: images.backButton
          }}
          action={() => {
            NavigationStore.popView()
          }}
        />
        <Text style={styles.description}>
          Please select the address you would like to interact with.
        </Text>
        <View style={styles.rowTitle}>
          <Text style={styles.title}>Your Address</Text>
          <Text style={styles.title}>Balance</Text>
        </View>
        <View style={styles.line} />
        <FlatList
          style={{ flex: 1 }}
          data={data}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <ChooseAddressItem
                item={item}
                index={index}
                onItemSelect={(i) => {
                  ImportWalletStore.setSelectedWallet(i)
                }}
              />
            )
          }}
        />
        <View style={styles.actionButton}>
          <ActionButton
            style={{ height: 40, paddingHorizontal: 17, shadowOpacity: 0.2 }}
            buttonItem={{
              name: constant.UNLOCK_YOUR_WALLET,
              icon: null,
              background: '#121734'
            }
            }
            imgBackgroundStyle={{ width: 169 }}
            styleText={{ color: AppStyle.mainColor }}
            action={() => {
              const index = ImportWalletStore.selectedWallet
              if (index === -1) {
                NavigationStore.showPopup('You need to choose a wallet')
                return
              }
              WalletStore.importWalletViaMnemonic(data[index], index).then((res) => {
                ImportWalletStore.setSelectedWallet(-1)
                returnData()
                NavigationStore.popToRootView()
                // NavigationStore.dismissView()
              }).catch((err) => {
                NavigationStore.showPopup(err.message)
              })
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: AppStyle.center,
    flex: 1
  },
  description: {
    marginTop: 20,
    width,
    paddingHorizontal: 20,
    fontFamily: AppStyle.mainFontBold,
    fontSize: 18,
    color: AppStyle.mainTextColor
  },
  actionButton: {
    position: 'absolute',
    right: 20,
    bottom: 20 + extraBottom
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: AppStyle.center,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 30,
    width
  },
  title: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 18,
    color: AppStyle.mainColor
  },
  line: {
    backgroundColor: AppStyle.colorLines,
    height: 1,
    width: width - 40,
    marginTop: 20
  }
})
