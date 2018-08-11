import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  FlatList,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import PropTypes from 'prop-types'
import NavigationHeader from '../elements/NavigationHeader'
import images from '../../commons/images'
import TransactionDetailItem from '../elements/TransactionDetailItem'
import AppStyle from '../../commons/AppStyle'
import constant from '../../commons/constant'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const { width, height } = Dimensions.get('window')
const isIPX = height === 812

export default class TransactionDetailInfo extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    onClose: PropTypes.func,
    dataTransactionInfo: PropTypes.array,
    transactionDetailInfo: PropTypes.array
  }

  static defaultProps = {
    onClose: () => { },
    dataTransactionInfo: null,
    transactionDetailInfo: null
  }

  render() {
    const { onClose, dataTransactionInfo, transactionDetailInfo } = this.props
    const dataTransaction = dataTransactionInfo || transactionDetailInfo
    return (
      <View style={[styles.container, { paddingTop: 26 }]}>
        <NavigationHeader
          style={{ width }}
          headerItem={{
            title: dataTransaction[0].type,
            icon: null,
            button: images.closeButton
          }}
          action={() => {
            dataTransactionInfo && onClose()
          }}
        />

        <FlatList
          style={{ width, marginBottom: 20 }}
          data={dataTransaction}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <TransactionDetailItem
                index={index}
                detailItem={item}
                action={() => {
                  Clipboard.setString(item.subtitle)
                  NavigationStore.showToast('Copied')
                }}
              />
            )
          }}
        />

        <View style={styles.checkButton}>
          <TouchableOpacity
            style={styles.imageCheck}
            onPress={() => {
              const tx = dataTransaction[2].subtitle
              NavigationStore.navigateTo(ScreenID.TxHashWebView, {
                txHash: tx
              })
            }}
          >
            <Text style={styles.check}>{constant.TEXT_VIEW_DETAIL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: AppStyle.center,
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  checkButton: {
    marginTop: 20,
    height: 50,
    bottom: isIPX ? 120 : 90,
    backgroundColor: '#121734',
    borderRadius: 5
  },
  check: {
    color: AppStyle.mainColor,
    fontSize: 18,
    fontFamily: AppStyle.mainFontBold
  },
  imageCheck: {
    width: width - 40,
    height: 50,
    alignItems: AppStyle.center,
    justifyContent: AppStyle.center,
    borderRadius: 5
  }
})
