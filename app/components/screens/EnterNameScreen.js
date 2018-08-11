import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../elements/NavigationHeader'
import InputWithAction from '../elements/InputWithActionItem'
import images from '../../commons/images'
import BottomButton from '../elements/BottomButton'
import WalletStore from '../../stores/WalletStore'
import Spinner from '../elements/Spinner'
import AppStyle from '../../commons/AppStyle'
import Checker from '../../Handler/Checker'
// import LayoutUtils from '../../commons/LayoutUtils'
import NavigationStore from '../../navigation/NavigationStore'

const { width } = Dimensions.get('window')
// const marginTop = LayoutUtils.getExtraTopAndroid()
const marginTop = 0

@observer
export default class EnterNameScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    returnData: PropTypes.func
  }

  static defaultProps = {
    returnData: () => { }
  }

  state = {
    name: `My wallet ${WalletStore.dataCards.length}`,
    showError: false
  }

  onChangeText = (text) => {
    const wallets = WalletStore.dataCards
    const isExist = Checker.checkNameIsExist(wallets, text)
    this.setState({
      name: text,
      showError: isExist
    })
  }

  handleBack = () => {
    // Keyboard.dismiss()
    setTimeout(() => {
      NavigationStore.popView()
    })
  }

  renderErrorField = () => {
    const { showError } = this.state
    if (showError) {
      return <Text style={styles.errorText}>Name was exist. Choose another is better.</Text>
    }
    return <View />
  }

  render() {
    const { name, showError } = this.state
    const { returnData } = this.props
    const loading = WalletStore.isCreateLoading
    return (
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop, width }}
              headerItem={{
                title: 'Type your wallet name',
                icon: null,
                button: images.backButton
                // button: images.closeButton
              }}
              action={this.handleBack}
            />
            <InputWithAction
              delayFocus={Platform.OS === 'ios' ? 500 : 300}
              style={{ width: width - 40, marginTop: 25 }}
              placeholder="Address Name"
              value={name}
              onChangeText={this.onChangeText}
            />
            {this.renderErrorField()}
            <BottomButton
              enable={!showError}
              text="Create"
              onPress={() => {
                if (showError) {
                  NavigationStore.showPopup('Wallet\'s name is existed')
                  return
                }
                WalletStore.createWalletViaMnemonic(name).then((res) => {
                  WalletStore.setCreateLoading(false)
                  NavigationStore.popToRootView()
                  returnData()
                  NavigationStore.showToast(`${name} was successfully created!`, { color: AppStyle.colorUp })
                }).catch(e => () => { })
              }}
            />
            {loading &&
              <Spinner />
            }
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: isIphoneX ? 44 : 0
  },
  errorText: {
    color: AppStyle.Color.errorColor,
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    marginTop: 10,
    marginLeft: 20,
    alignSelf: 'flex-start'
  }
})
