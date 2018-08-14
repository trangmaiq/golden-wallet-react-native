import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions
} from 'react-native'
import PropsType from 'prop-types'
import NavigationHeader from './../elements/NavigationHeader'
import ManageWalletItem from './../elements/ManageWalletItem'
import images from './../../commons/images'
import appStyle from './../../commons/AppStyle'
import LayoutUtils from '../../commons/LayoutUtils'

const { width } = Dimensions.get('window')
const marginTop = LayoutUtils.getExtraTop()

export default class ContactsElementScreen extends Component {
  static propTypes = {
    navigation: PropsType.object
  }

  static defaultProps = {
    navigation: null
  }
  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          headerItem={{
            title: 'Contacts',
            icon: null,
            button: images.closeButton
          }}
          action={() => this.props.navigation.goBack()}
        />
        <FlatList
          data={dumpData}
          showsVerticalScrollIndicator={false}
          style={styles.listButton}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <ManageWalletItem
                wallet={item}
                action={() => { }}
              />
            )
          }}
        />
        <TouchableOpacity
          style={styles.buttonBottom}
          onPress={() => { }}
        >
          <Text style={styles.textSendContact}>
            Add Contact
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: marginTop + 20
  },
  listButton: {
    flex: 1,
    marginTop: 30,
    marginBottom: 35,
    paddingHorizontal: 20
  },
  buttonBottom: {
    borderRadius: 5,
    height: 50,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 20,
    backgroundColor: appStyle.backgroundBlue
  },
  textSendContact: {
    fontFamily: 'OpenSans-Semibold',
    fontSize: 18,
    color: 'white'
  }
})

const dumpData = [
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen dai dai dai dai dai',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  },
  {
    name: 'Jason Nguyen',
    address: '0x27fa68a776af552d73c77631bcfcb8f47b1b62e9'
  }
]
