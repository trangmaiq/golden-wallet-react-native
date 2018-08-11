import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native'
import PropsType from 'prop-types'
import lodash from 'lodash'
import AppStyle from '../../commons/AppStyle'
import ActionButton from '../elements/ActionButton'
import constant from '../../commons/constant'
import WalletStore from '../../stores/WalletStore'
import TagList from '../elements/TagList'
import HapticHandler from '../../Handler/HapticHandler'

import NavigationStore from '../../navigation/NavigationStore'
import ScreenID from '../../navigation/ScreenID'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569

export default class BackupChooseKeywordScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  }

  static propTypes = {
    arrayMnemonic: PropsType.array.isRequired
  }

  constructor(props) {
    super(props)
    const { arrayMnemonic } = this.props
    this.state = {
      listKeywordRandom: lodash.shuffle(arrayMnemonic),
      listKeyWordChoose: arrayMnemonic.map(str => ''),
      buttonStates: arrayMnemonic.map(str => true)
    }
  }

  removeChooseMnemonicWord(word) {
    if (word === '') {
      return
    }
    const index = this.state.listKeywordRandom.indexOf(word)
    this.state.buttonStates[index] = true
    this.state.listKeyWordChoose = this.state.listKeyWordChoose.filter((str) => {
      return str !== word
    })
    this.state.listKeyWordChoose.push('')
    this.setState({
      buttonStates: this.state.buttonStates,
      listKeyWordChoose: this.state.listKeyWordChoose
    })
  }

  chooseMnemonicWord(word) {
    const index = this.state.listKeywordRandom.indexOf(word)
    this.state.buttonStates[index] = false
    for (let i = 0; i < this.state.listKeyWordChoose.length; ++i) {
      if (this.state.listKeyWordChoose[i] === '') {
        this.state.listKeyWordChoose[i] = word
        break
      }
    }
    this.setState({
      buttonStates: this.state.buttonStates,
      listKeyWordChoose: this.state.listKeyWordChoose
    })
  }

  render() {
    const {
      arrayMnemonic
    } = this.props
    const {
      listKeyWordChoose,
      buttonStates,
      listKeywordRandom
    } = this.state
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <Text style={styles.titleTop}>
              Verify your Mnemonic phrases.
            </Text>
            <Text style={[styles.titleTop, { marginTop: 10, marginBottom: 10 }]}>
              Choose each word in the correct order.
            </Text>
            <TagList
              isCenter
              isShowOrder
              arrayMnemonic={listKeyWordChoose}
              onItemPress={(word) => {
                // this.props.onRemoveItem(word)
                this.removeChooseMnemonicWord(word)
              }}
              style={{
                paddingVerticalOfItem: 12,
                numberOfWordInRow: 3,
                margin: 20,
                marginTop: isSmallScreen ? 12 : 20,
                backgroundColor: AppStyle.backgroundContentDarkMode,
                itemBackgroundColor: '#1E2336',
                itemTextColor: '#7F8286',
                fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
                fontWeight: 'normal',
                itemFontSize: isSmallScreen ? 12 : 14,
                userInteractionEnabled: true
              }}
            />
            <TagList
              arrayMnemonic={listKeywordRandom}
              onItemPress={(word) => {
                // this.props.onAddItem(word)
                this.chooseMnemonicWord(word)
              }}
              isCenter
              buttonStates={buttonStates}
              style={{
                paddingVerticalOfItem: 10,
                numberOfWordInRow: 3,
                margin: 20,
                marginTop: 0,
                backgroundColor: AppStyle.backgroundDarkMode,
                itemBackgroundColor: AppStyle.backgroundContentDarkMode,
                itemTextColor: '#8A8D97',
                fontFamily: Platform.OS === 'ios' ? 'OpenSans' : 'OpenSans-Regular',
                fontWeight: '500',
                itemFontSize: isSmallScreen ? 12 : 14,
                userInteractionEnabled: true
              }}
            />
          </View>
          <View style={styles.buttonBlue}>
            <ActionButton
              buttonItem={{
                name: constant.CONFIRM,
                background: '#121734'
              }}
              imgBackgroundStyle={{ width: 91 }}
              action={() => {
                if (JSON.stringify(arrayMnemonic) === JSON.stringify(listKeyWordChoose)) {
                  WalletStore.saveIsBackup()
                  NavigationStore.navigateTo(ScreenID.BackupFinishScreen)
                } else {
                  HapticHandler.ImpactLight()
                  NavigationStore.showPopup('Mnemonic incorrect')
                }
              }}
              styleText={{
                fontFamily: 'OpenSans-Semibold',
                fontSize: 14,
                letterSpacing: 0.7,
                color: '#E4BF43'
              }}
            />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  titleTop: {
    fontSize: isSmallScreen ? 16 : 18,
    marginHorizontal: 20,
    color: AppStyle.titleDarkModeColor,
    fontFamily: 'OpenSans-Bold',
    alignSelf: 'flex-start'
  },
  buttonBlue: {
    alignSelf: 'flex-end',
    marginBottom: 30,
    marginRight: 20
  }
})
