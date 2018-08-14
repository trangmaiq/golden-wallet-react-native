import React, { Component } from 'react'
import { View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import AppStyle from './commons/AppStyle'
import NavStore from './stores/NavStore'
import PopupCustom from './components/elements/PopupCustom'
import CustomToastTop from './components/elements/CustomToastTop'

// screen
import HomeScreen from './modules/WalletList/screen/HomeScreen'
import CreateWalletScreen from './modules/WalletCreate/screen/CreateWalletScreen'
import EnterNameScreen from './modules/WalletCreate/screen/EnterNameScreen'
import TransactionListScreen from './modules/TransactionList/screen/TransactionListScreen'
import ImportWalletScreen from './modules/WalletImport/screen/ImportWalletScreen'
import ImportViaMnemonicScreen from './modules/WalletImport/screen/ImportViaMnemonicScreen'
import ImportViaPrivateKeyScreen from './modules/WalletImport/screen/ImportViaPrivateKeyScreen'
import ImportViaAddressScreen from './modules/WalletImport/screen/ImportViaAddressScreen'
import ChooseAddressScreen from './modules/WalletImport/screen/ChooseAddressScreen'
import TokenScreen from './modules/WalletDetail/screen/TokenScreen'
import SendTransactionScreen from './modules/SendTransaction/screen/SendTransactionScreen'
import UnlockScreen from './modules/Unlock'
import ScanQRCodeScreen from './modules/ScanQRCode'
import BackupScreen from './modules/WalletBackup/screen/BackupScreen'
import PrivacyPolicyWebView from './modules/Setting/screen/PrivacyPolicyWebView'
import ImplementPrivateKeyScreen from './modules/WalletImport/screen/ImplementPrivateKeyScreen'
import AddressBookScreen from './modules/AddressBook/screen/AddressBookScreen'
import AddAddressBookScreen from './modules/AddressBook/screen/AddAddressBookScreen'
import BackupFinishScreen from './modules/WalletBackup/screen/BackupFinishScreen'
import ManageWalletScreen from './modules/Setting/screen/ManageWalletScreen'
import TxHashWebViewScreen from './modules/TransactionDetail/screen/TxHashWebView'
import NetworkScreen from './modules/Setting/screen/NetworkScreen'
import DWebBrowserScreen from './components/screens/DWebBrowserScreen'
import AddressInputScreen from './modules/SendTransaction/screen/AddressInputScreen'

const AddressBookStack = StackNavigator(
  {
    AddressBookScreen: {
      screen: AddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    AddAddressBookScreen: {
      screen: AddAddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'AddressBookScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const HomeStack = StackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    NetworkScreen: {
      screen: NetworkScreen,
      navigationOptions: {
        header: null
      }
    },
    AddAddressBookScreen: {
      screen: AddAddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    ManageWalletScreen: {
      screen: ManageWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    TokenScreen: {
      screen: TokenScreen,
      navigationOptions: {
        header: null
      }
    },
    TransactionListScreen: {
      screen: TransactionListScreen,
      navigationOptions: {
        header: null
      }
    },
    BackupScreen: {
      screen: BackupScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    PrivacyPolicyWebView: {
      screen: PrivacyPolicyWebView,
      navigationOptions: {
        header: null
      }
    },
    ImplementPrivateKeyScreen: {
      screen: ImplementPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressBookScreen: {
      screen: AddressBookScreen,
      navigationOptions: {
        header: null
      }
    },
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    },
    TxHashWebViewScreen: {
      screen: TxHashWebViewScreen,
      navigationOptions: {
        header: null
      }
    },
    DWebBrowserScreen: {
      screen: DWebBrowserScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'HomeScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const CreateSendTransactionStack = StackNavigator(
  {
    SendTransactionScreen1: {
      screen: SendTransactionScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressInputScreen: {
      screen: AddressInputScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'SendTransactionScreen1',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const CreateWalletStack = StackNavigator(
  {
    CreateWalletScreen: {
      screen: CreateWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportWalletScreen: {
      screen: ImportWalletScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaMnemonicScreen: {
      screen: ImportViaMnemonicScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaPrivateKeyScreen: {
      screen: ImportViaPrivateKeyScreen,
      navigationOptions: {
        header: null
      }
    },
    ImportViaAddressScreen: {
      screen: ImportViaAddressScreen,
      navigationOptions: {
        header: null
      }
    },
    ChooseAddressScreen: {
      screen: ChooseAddressScreen,
      navigationOptions: {
        header: null
      }
    },
    ScanQRCodeScreen: {
      screen: ScanQRCodeScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'CreateWalletScreen',
    cardStyle: { backgroundColor: AppStyle.backgroundColor }
  }
)

const Router = StackNavigator(
  {
    HomeStack: {
      screen: HomeStack,
      navigationOptions: {
        header: null
      }
    },
    UnlockScreen: {
      screen: UnlockScreen,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    SendTransactionStack: {
      screen: CreateSendTransactionStack,
      navigationOptions: {
        header: null,
        gesturesEnabled: false
      }
    },
    CreateWalletStack: {
      screen: CreateWalletStack,
      navigationOptions: {
        header: null
      }
    },
    BackupFinishScreen: {
      screen: BackupFinishScreen,
      navigationOptions: {
        header: null
      }
    },
    AddressBookStack: {
      screen: AddressBookStack,
      navigationOptions: {
        header: null
      }
    },
    EnterNameScreen: {
      screen: EnterNameScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: 'HomeStack',
    cardStyle: { backgroundColor: AppStyle.backgroundColor },
    mode: 'modal'
  }
)

export default class MainStack extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Router
          onNavigationStateChange={(prev, next) => NavStore.onNavigationStateChange(prev, next)}
          ref={(ref) => { NavStore.navigator = ref }}
        />
        <PopupCustom
          ref={(popup) => {
            NavStore.popupCustom = popup
          }}
        />
        <CustomToastTop
          ref={(ref) => {
            NavStore.toastTop = ref
          }}
        />
      </View>
    )
  }
}
