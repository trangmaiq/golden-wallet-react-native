import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react/native'
import images from '../../../commons/images'
import AppStyle from '../../../commons/AppStyle'
import MainStore from '../../../AppStores/MainStore'

@observer
export default class NetworkItem extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    item: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
  }

  static defaultProps = {
    onPress: () => { }
  }

  get currentNetwork() {
    return MainStore.appState.config.network
  }

  render() {
    const { item, onPress, index } = this.props
    const borderTopWidth = index === 0 ? 0 : 1
    const network = item.replace(/^\w/, c => c.toUpperCase())
    return (
      <TouchableOpacity onPress={() => { onPress(item) }}>
        <View style={[styles.rowSubtitle, { borderTopWidth }]}>
          <Text style={styles.textSubtitle}>{network}</Text>
          {this.currentNetwork === item && <Image source={images.iconCheck} />}
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  rowSubtitle: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppStyle.backgroundTextInput,
    borderColor: AppStyle.borderLinesSetting,
    justifyContent: 'space-between'
  },
  textSubtitle: {
    fontSize: 14,
    fontFamily: AppStyle.mainFontSemiBold,
    color: AppStyle.secondaryTextColor
  }
})
