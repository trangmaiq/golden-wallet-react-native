import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Text
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import NavigationHeader from '../../../components/elements/NavigationHeader'
import InputWithAction from '../../../components/elements/InputWithActionItem'
import BottomButton from '../../../components/elements/BottomButton'
import LayoutUtils from '../../../commons/LayoutUtils'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import CreateWalletStore from '../CreateWalletStore'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTopAndroid()

@observer
export default class EnterNameScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object
  }

  static defaultProps = {
    navigation: {}
  }

  constructor(props) {
    super(props)
    this.createWalletStore = new CreateWalletStore()
  }

  onChangeText = (text) => {
    this.createWalletStore.setTitle(text)
  }

  handleBack = () => {
    const { navigation } = this.props
    Keyboard.dismiss()
    navigation.goBack()
  }

  handleCreate = () => {
    this.createWalletStore.handleCreateWallet()
  }

  renderErrorField = () => {
    const { isShowError } = this.createWalletStore
    if (isShowError) {
      return <Text style={styles.errorText}>Name was exist. Choose another is better.</Text>
    }
    return <View />
  }

  render() {
    const { title } = this.createWalletStore
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.container}>
            <NavigationHeader
              style={{ marginTop: marginTop + 20, width }}
              headerItem={{
                title: 'Type your wallet name',
                icon: null,
                button: images.closeButton
              }}
              action={this.handleBack}
            />
            <InputWithAction
              autoFocus
              style={{ width: width - 40, marginTop: 25 }}
              placeholder="Address Name"
              value={title}
              onChangeText={this.onChangeText}
            />
            {this.renderErrorField()}
            <BottomButton
              text="Create"
              onPress={this.handleCreate}
            />
            {/* {loading &&
              <Spinner />
            } */}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  errorText: {
    color: AppStyle.colorDown,
    fontSize: 14,
    fontFamily: 'OpenSans-Semibold',
    marginTop: 10,
    marginLeft: 20,
    alignSelf: 'flex-start'
  }
})
