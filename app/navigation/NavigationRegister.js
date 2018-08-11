import { Navigation } from 'react-native-navigation'
import AppScreen from './AppScreen'
import ScreenID from './ScreenID'
import CustomPopup from './CustomPopup'

class NavigationRegister {
  registerScreens() {
    Navigation.registerComponent(ScreenID.App, () => AppScreen.App)
    Navigation.registerComponent(ScreenID.AddContactScreen, () => AppScreen.AddContactScreen)
    Navigation.registerComponent(ScreenID.AddPrivateKeyScreen, () => AppScreen.AddPrivateKeyScreen)
    Navigation.registerComponent(ScreenID.AddressBookScreen, () => AppScreen.AddressBookScreen)
    Navigation.registerComponent(ScreenID.BackupChooseKeywordScreen, () => AppScreen.BackupChooseKeywordScreen)
    Navigation.registerComponent(ScreenID.BackupChooseSuccessScreen, () => AppScreen.BackupChooseSuccessScreen)
    Navigation.registerComponent(ScreenID.BackupFinishScreen, () => AppScreen.BackupFinishScreen)
    Navigation.registerComponent(ScreenID.BackupScreen, () => AppScreen.BackupScreen)
    Navigation.registerComponent(ScreenID.BackupWalletScreen, () => AppScreen.BackupWalletScreen)
    Navigation.registerComponent(ScreenID.BlindScreen, () => AppScreen.BlindScreen)
    Navigation.registerComponent(ScreenID.ChooseAddressScreen, () => AppScreen.ChooseAddressScreen)
    Navigation.registerComponent(ScreenID.ContactsElementScreen, () => AppScreen.ContactsElementScreen)
    Navigation.registerComponent(ScreenID.CreateSuccessScreen, () => AppScreen.CreateSuccessScreen)
    Navigation.registerComponent(ScreenID.CreateWalletScreen, () => AppScreen.CreateWalletScreen)
    Navigation.registerComponent(ScreenID.DWebBrowserScreen, () => AppScreen.DWebBrowserScreen)
    Navigation.registerComponent(ScreenID.EditYourWalletScreen, () => AppScreen.EditYourWalletScreen)
    Navigation.registerComponent(ScreenID.HomeScreen, () => AppScreen.HomeScreen)
    Navigation.registerComponent(ScreenID.ImportViaAddressScreen, () => AppScreen.ImportViaAddressScreen)
    Navigation.registerComponent(ScreenID.ImportViaMnemonicScreen, () => AppScreen.ImportViaMnemonicScreen)
    Navigation.registerComponent(ScreenID.ImportViaPrivateKeyScreen, () => AppScreen.ImportViaPrivateKeyScreen)
    Navigation.registerComponent(ScreenID.ImportWalletScreen, () => AppScreen.ImportWalletScreen)
    Navigation.registerComponent(ScreenID.ListWalletScreen, () => AppScreen.ListWalletScreen)
    Navigation.registerComponent(ScreenID.NetworkScreen, () => AppScreen.NetworkScreen)
    Navigation.registerComponent(ScreenID.PrivacyPolicyWebView, () => AppScreen.PrivacyPolicyWebView)
    Navigation.registerComponent(ScreenID.ReceiveScreen, () => AppScreen.ReceiveScreen)
    Navigation.registerComponent(ScreenID.ScanQRCodeScreen, () => AppScreen.ScanQRCodeScreen)
    Navigation.registerComponent(ScreenID.SelectedCoinScreen, () => AppScreen.SelectedCoinScreen)
    Navigation.registerComponent(ScreenID.SendTransactionScreen, () => AppScreen.SendTransactionScreen)
    Navigation.registerComponent(ScreenID.SettingScreen, () => AppScreen.SettingScreen)
    Navigation.registerComponent(ScreenID.TokenScreen, () => AppScreen.TokenScreen)
    Navigation.registerComponent(ScreenID.TransactionDetailInfo, () => AppScreen.TransactionDetailInfo)
    Navigation.registerComponent(ScreenID.TransactionDetailScreen, () => AppScreen.TransactionDetailScreen)
    Navigation.registerComponent(ScreenID.TxHashWebView, () => AppScreen.TxHashWebView)
    Navigation.registerComponent(ScreenID.UnlockScreen, () => AppScreen.UnlockScreen)
    Navigation.registerComponent(ScreenID.EnterNameScreen, () => AppScreen.EnterNameScreen)

    Navigation.registerComponent(ScreenID.NormalPopup, () => CustomPopup.NormalPopup)
    Navigation.registerComponent(ScreenID.BinaryPopup, () => CustomPopup.BinaryPopup)

    Navigation.registerComponent(ScreenID.CustomToastTop, () => CustomPopup.CustomToastTop)

    Navigation.registerComponent(ScreenID.AddressInputScreen, () => AppScreen.AddressInputScreen)
  }
}

export default new NavigationRegister()
