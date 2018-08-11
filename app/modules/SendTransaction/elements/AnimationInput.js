import React, { Component } from 'react'
import { Animated, Text, View, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import AnimationInputItem from './AnimationInputItem'
import AppStyle from '../../../commons/AppStyle';
import sendTransactionStore from '../stores/SendTransactionStore';
import Helper from '../../../commons/Helper';
import images from '../../../commons/images';
import { observer } from 'mobx-react';
import HapticHandler from '../../../Handler/HapticHandler'
import Starypto from '../../../../Libs/react-native-starypto'

const dataRef = {}
const BN = require('bn.js')
@observer
export default class AnimationInput extends Component {
  static propTypes = {
    prefix: PropTypes.string,
    defaultValue: PropTypes.string,
    postfix: PropTypes.string,
  }

  // static defaultProps = {
  //   prefix: '$',
  //   postfix: 'ETH'
  // }

  constructor(props) {
    super(props)
    // this.state = {
    //   data: [],
    //   subData: [],
    //   isHadPoint: false,
    //   type: false // true = 'prefix', fasle = 'postfix'
    // }
  }

  // componentDidUpdate() {
  //   if (this.state.data.length == 0) sendTransactionStore.dataInit = true
  //   else sendTransactionStore.dataInit = false
  //   sendTransactionStore.triggerChangeType = this.state.type
  //   if (sendTransactionStore.cryptoValue > this.props.cryptoBalance) sendTransactionStore.warningOver = true
  //   else sendTransactionStore.warningOver = false
  // }

  add(item) {
    const { data, subData, isHadPoint, type } = sendTransactionStore.numberArray
    if (data.length == (type ? 9 : 6) && item.text !== '.' && !isHadPoint) return
    else if (data.length == 0 && item.text == '.') {
      let data = [{ text: '0' }, item]
      let subData = type ?
        [{ text: '0' }, { text: '' }] :
        [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }]
      // this.setState({ subData, data, isHadPoint: true })
      sendTransactionStore.setNumberArray({ data, subData, isHadPoint: true })
      return
    }
    else if (data.length == 1 && item.text !== '.' && data[0].text == '0') {
      data.pop()
      data.push(item)
      // this.setState({ data, isHadPoint: false })
      sendTransactionStore.setNumberArray({ data, isHadPoint: false })
      return
    }
    else if (isHadPoint && item.text === '.') return
    else if (subData.length > 0) {
      data.push(item)
      subData.pop()
      // this.setState({ subData, data })
      sendTransactionStore.setNumberArray({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) return
    const zeroAfterPoint = item.text === '.' ? (type ? [{ text: '0' }, { text: '' }] : [{ text: '0' }, { text: '' }, { text: '' }, { text: '' }]) : []
    if (data.length == 3 && item.text !== '.') data.splice(1, 0, { text: ',' })
    else if (data.length == 5 && item.text !== '.') {
      data.splice(1, 1)
      data.splice(2, 0, { text: ',' })
    }
    else if (data.length == 6 && item.text !== '.') {
      data.splice(2, 1)
      data.splice(3, 0, { text: ',' })
    }
    else if (data.length == 7 && item.text !== '.') {
      data.splice(3, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    }
    // this.setState({ data: [...this.state.data, item], subData: zeroAfterPoint, isHadPoint: item.text === '.' ? true : this.state.isHadPoint })
    sendTransactionStore.setNumberArray({ data: [...data, item], subData: zeroAfterPoint, isHadPoint: item.text === '.' ? true : isHadPoint })
  }

  clearAll() {
    const { data, subData, type, isHadPoint } = sendTransactionStore.numberArray
    sendTransactionStore.setNumberArray({ data: [], subData: [], isHadPoint: false })
  }

  remove() {
    const { data, subData, type, isHadPoint } = sendTransactionStore.numberArray
    if (subData.length == (type ? 2 : 4)) {
      data.pop()
      // this.setState({ subData: [], isHadPoint: false })
      sendTransactionStore.setNumberArray({ subData: [], isHadPoint: false })
      return
    } else if (subData.length > 0) {
      data.pop()
      subData.push({ text: '' })
      // this.setState({ subData, data })
      sendTransactionStore.setNumberArray({ subData, data })
      return
    } else if (subData.length == 0 && isHadPoint) {
      const item = data.pop()
      subData.push({ text: '0' })
      // this.setState({ data, subData, isHadPoint: item.text === '.' ? false : this.state.isHadPoint })
      sendTransactionStore.setNumberArray({ data, subData, isHadPoint: item.text === '.' ? false : isHadPoint })
      return
    } else if (data.length == 0) return
    const item = data.pop()
    if (data.length == 4) data.splice(1, 1)
    else if (data.length == 5) {
      data.splice(2, 1)
      data.splice(1, 0, { text: ',' })
    } else if (data.length == 6) {
      data.splice(3, 1)
      data.splice(2, 0, { text: ',' })
    } else if (data.length == 8) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(3, 0, { text: ',' })
    } else if (data.length == 9) {
      data.splice(2, 1)
      data.splice(5, 1)
      data.splice(1, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.length == 10) {
      data.splice(3, 1)
      data.splice(6, 1)
      data.splice(2, 0, { text: ',' })
      data.splice(5, 0, { text: ',' })
    } else if (data.lenth == 12) {
      data.splice(1, 1)
      data.splice(4, 1)
      data.splice(7, 1)
      data.splice(3, 0, { text: ',' })
      data.splice(7, 0, { text: ',' })
    }
    dataRef[`${data.length}`] && dataRef[`${data.length}`].removeAnimation()
    // this.setState({ data, isHadPoint: item.text === '.' ? false : this.state.isHadPoint })
    sendTransactionStore.setNumberArray({ data, isHadPoint: item.text === '.' ? false : isHadPoint })
  }

  formatArrayToNumberFloat(data, subData, type) {
    const array = [...data, ...subData]
    let string = ''
    array.forEach((element) => {
      string += element.text
    })
    const value = isNaN(parseFloat(string.replace(/,/g, ''))) ? 0 : parseFloat(string.replace(/,/g, ''))
    return type ? +value.toFixed(2) : +value.toFixed(4)
  }

  formatCryptoToMoney(crypto) {
    return +(crypto * sendTransactionStore.wallet.ratio).toFixed(2)
  }

  formatMoneyToCrypto(money) {
    return +(money / sendTransactionStore.wallet.ratio).toFixed(4)
  }

  updateStore(data, subData, type) {
    sendTransactionStore.moneyValue = type ?
      this.formatArrayToNumberFloat(data, subData, type) :
      this.formatCryptoToMoney(this.formatArrayToNumberFloat(data, subData, type))
    sendTransactionStore.cryptoValue = type ?
      this.formatMoneyToCrypto(this.formatArrayToNumberFloat(data, subData, type)) :
      this.formatArrayToNumberFloat(data, subData, type)
  }

  checkAmount(inputStr, balanceStr) {
    return Starypto.Units.parseUnits(inputStr, 18)._bn.lte(Starypto.Units.parseUnits(balanceStr, 18)._bn)
  }

  render() {
    const { data, subData, type, isHadPoint } = sendTransactionStore.numberArray
    const { prefix, defaultValue, postfix, cryptoBalance = 0, moneyBalance = 0 } = this.props
    this.updateStore(data, subData, type)
    const amountStr = data.slice().map(s => s.text).join('')
    const amountIsValidUSD = (this.checkAmount(amountStr || '0', `${moneyBalance}` || '0'))
    const amountIsValid = (this.checkAmount(amountStr || '0', `${cryptoBalance}` || '0'))
    return (
      <View style={{ justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignSelf: 'center', height: 70 }}>
          {type && <Text style={{ color: (!data || data.length === 0) ? AppStyle.greyTextInput : 'white', fontSize: data.length + (isHadPoint ? (subData.length == 0 ? 0 : 1) : 0) > (type ? 9 : 6) ? 40 : 60 }}>
            {prefix}
          </Text>}
          {(!data || data.length === 0) && <Text style={{ color: AppStyle.greyTextInput, fontSize: 60 }}>{type ? '0' : '0.0'}</Text>}
          {data.map((item, index) => {
            const { text = '', animated = true } = item
            return (
              <AnimationInputItem
                key={`${index}`}
                sizeSmall={data.length + (isHadPoint ? (subData.length == 0 ? 0 : 1) : 0) > (type ? 9 : 6)}
                ref={ref => (dataRef[index] = ref)}
                text={text}
                animated={animated}
              />
            )
          })}
          {subData.map((item, index) => {
            const { text = '', animated = true } = item
            return (
              <AnimationInputItem
                sub={true}
                key={`${index}`}
                sizeSmall={data.length + (isHadPoint ? (subData.length == 0 ? 0 : 1) : 0) > (type ? 9 : 6)}
                ref={ref => (dataRef[index] = ref)}
                text={text}
                animated={animated}
              />
            )
          })}
          {!type && <Text style={{ color: (!data || data.length === 0) ? AppStyle.greyTextInput : 'white', fontSize: data.length + (isHadPoint ? (subData.length == 0 ? 0 : 1) : 0) > (type ? 9 : 6) ? 40 : 60, marginLeft: 15 }}>
            {postfix}
          </Text>}
        </View>
        <View
          style={{ justifyContent: 'center', flexDirection: 'row', height: 60 }}
        >
          <View>
            <Text style={{ color: (!data || data.length === 0) ? AppStyle.greyTextInput : AppStyle.secondaryTextColor, alignSelf: 'center', marginTop: 10, fontSize: 20 }}>{data.length > 0 ? (type ? (+sendTransactionStore.cryptoValue.toFixed(4)).toLocaleString('en-US', { minimumFractionDigits: 4 }) + ` ${postfix}` : `${prefix}` + (+sendTransactionStore.moneyValue.toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2 })) : (type ? `0.0 ${postfix}` : `${prefix}0`)}</Text>
            {(type ? !amountIsValidUSD : !amountIsValid) &&
              <Text style={{ color: 'red', alignSelf: 'center', fontSize: 14, marginTop: 10 }}>Not Enough Balance</Text>}
          </View>
          <TouchableOpacity
            style={{ right: 30, top: 0, position: 'absolute', marginTop: 15 }}
            onPress={() => {
              HapticHandler.ImpactLight()
              sendTransactionStore.setNumberArray({ type: !type, data: [], subData: [], isHadPoint: false })
            }}
          >
            <Image source={images.exchangeIcon} style={{ width: 30, height: 30 }} resizeMode='contain' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
