import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native'
import { observer } from 'mobx-react/native'
import AppStyle from '../../../commons/AppStyle'
import ActionButton from '../../../components/elements/ActionButton'
import constant from '../../../commons/constant'
import TagList from './TagList'
import MainStore from '../../../AppStores/MainStore'

const { height } = Dimensions.get('window')
const isSmallScreen = height < 569

@observer
export default class BackupThirdStep extends Component {
  static propTypes = {

  }

  onAddWord = (word) => {
    this.backupStore.addWord(word)
  }

  onRemoveWord = (word) => {
    this.backupStore.removeWord(word)
  }

  onConfirmMnemonic = () => {
    this.backupStore.confirmMnemonic()
  }

  get backupStore() {
    return MainStore.backupStore
  }

  render() {
    const {
      obj
    } = this.backupStore
    const {
      listKeyWordChoose,
      buttonStates,
      listKeywordRandom
    } = obj
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
              arrayMnemonic={listKeyWordChoose.slice()}
              onItemPress={this.onRemoveWord}
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
              arrayMnemonic={listKeywordRandom.slice()}
              onItemPress={this.onAddWord}
              isCenter
              buttonStates={buttonStates.slice()}
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
              action={this.onConfirmMnemonic}
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
