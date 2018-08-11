import { Navigation } from 'react-native-navigation'
import { Keyboard } from 'react-native'
import ScreenID from './ScreenID'
import AppStyle from '../commons/AppStyle'
import NavigationRegister from './NavigationRegister'
// import Stack from '../commons/Stack'
import HapticHandler from '../Handler/HapticHandler'
import WalletStore from '../stores/WalletStore'
import PushNotificationHelper from '../commons/PushNotificationHelper'

class NavigationStore {
  constructor() {
    NavigationRegister.registerScreens()
    this.navigation = null
    this.navigations = []
    this.currentScreen = ScreenID.App
    this.backgroundByPermission = false
    this.isShowNotif = true
    this.unLockScreen = null
  }

  setupInitNavigation(navigator) {
    this.navigation = navigator
    this.navigations.push(navigator)
  }

  _initStack() {
    // this.screenStack = new Stack()
    // this.screenStack.push(new Stack())
    // this.screenStack.top().push(ScreenID.App)
  }

  /**
   * Register all screen to navigation
   */
  registerScreen() {
    NavigationRegister.registerScreens()
  }

  /**
   *
   * @param {string} screenID
   */
  createSinglePageApp(screenID) {
    Navigation.startSingleScreenApp({
      screen: {
        screen: screenID
      },
      appStyle: {
        navBarHidden: true,
        screenBackgroundColor: AppStyle.backgroundColor
      }
    })
  }

  getCurrenScreen() {
    return this.currentScreen
  }

  _setCurrentScreen() {
    this.currentScreen = null
  }

  /**
   * Use to navigate detail Screen
   * @param {String} screenID
   * @param {Object} params
   */
  navigateTo = (screenID, params) => {
    this.currentScreen = screenID
    // this.screenStack.top().push(screenID)
    this.navigation.push({
      screen: screenID,
      passProps: params
    })
  }

  /**
   * Use to show a new Screen
   * @param {String} screenID
   * @param {Object} params
   */
  showModal = (screenID, params, animated = true) => {
    // this.screenStack.push(new Stack())
    // this.screenStack.top().push(screenID)
    if (screenID === ScreenID.UnlockScreen) {
      this.isShowNotif = false
      PushNotificationHelper.removeAllDeliveredNotifications()
    }
    this.currentScreen = screenID
    this.navigation.showModal({
      screen: screenID,
      passProps: params,
      animationType: animated ? 'slide-up' : 'none'
    })
  }

  /**
   * Use to pop back to previous view
   */
  popView = () => {
    // this.screenStack.pop()
    this._setCurrentScreen()
    this.navigation.pop()
  }

  popToRootView = () => {
    this._setCurrentScreen()
    this.navigation.popToRoot()
  }

  /**
   * Use to show previous view
   */
  dismissView = (animated = true) => {
    if (this.currentScreen === ScreenID.UnlockScreen) {
      this.unLockScreen = null
    }
    this._setCurrentScreen()
    this.navigations.pop()
    this.navigation = this.navigations[this.navigations.length - 1]
    this.navigation.dismissModal({
      animationType: animated ? 'slide-down' : 'none'
    })
  }

  /**
   * Use to normal show a custom popup with title and content
   * @param {string} title
   * @param {string} content
   */
  showPopup = (title, onClose = this.dismissPopup) => {
    Keyboard.dismiss()
    this.navigation.showLightBox({
      screen: ScreenID.NormalPopup,
      passProps: {
        title,
        onClose
      },
      style: {
        backgroundBlur: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        tapBackgroundToDismiss: true
      }
    })
  }

  /**
   *
   * @param {string} title
   * @param {object} twoAction
   */
  showBinaryPopup = (title, { firstAction, secondAction }, content = '', type = 'normal') => {
    this.navigation.showLightBox({
      screen: ScreenID.BinaryPopup,
      passProps: {
        title,
        content,
        type,
        firstAction: {
          title: firstAction.title,
          action: () => {
            firstAction.action()
            this.dismissPopup()
          }
        },
        secondAction: {
          title: secondAction.title,
          action: (text) => {
            secondAction.action(text)
            this.dismissPopup()
          }
        }
      },
      style: {
        backgroundBlur: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        tapBackgroundToDismiss: true,
        disableAffineTransform: true
      }
    })
  }

  /**
   * Show Blind View
   */
  showBlindView = () => {
    this.navigation.showLightBox({
      screen: ScreenID.BlindScreen,
      style: {
        backgroundBlur: 'none',
        disableAffineTransform: true
      }
    })
  }

  /**
   * Close popup
   */
  dismissPopup = () => {
    this.navigation.dismissLightBox()
  }

  /**
   * Show a view on top, default color is mainColor
   * @param {string} content
   * @param {object} styleText
   * @param {function} action
   */
  showToast = (content, styleText = {}, information = null) => {
    HapticHandler.ImpactLight()

    this.navigation.showInAppNotification({
      screen: ScreenID.CustomToastTop,
      passProps: {
        content,
        styleText,
        information
      },
      autoDismissTimerSec: 2
    })
  }

  showNotification(notification) {
    const {
      value,
      address,
      contract,
      wallet,
      tx
    } = notification

    const jsonTx = JSON.parse(tx)
    const {
      from,
      symbol,
      to,
      type
    } = jsonTx

    if (type === 'Sent') {
      const walletObj = WalletStore.dataCards.filter(walletCard => walletCard.address === from).pop()
      const str = `${walletObj.cardName} has sent ${value} ${symbol}`
      this.showToast(
        str,
        {
          color: AppStyle.colorDown
        },
        {
          address,
          name: wallet,
          addressToken: contract,
          tx
        }
      )
    } else {
      const walletObj = WalletStore.dataCards.filter(walletCard => walletCard.address === to).pop()
      const str = `${walletObj.cardName} has received ${value} ${symbol}`
      this.showToast(
        str,
        {
          color: AppStyle.colorUp
        },
        {
          address,
          name: wallet,
          addressToken: contract,
          tx
        }
      )
    }
  }

  /**
   * Show alert with red background and white text
   * @param {string} content
   */
  showToastAlert(content) {
    HapticHandler.ImpactLight()

    this.navigation.showInAppNotification({
      screen: ScreenID.CustomToastTop,
      passProps: {
        content,
        style: { backgroundColor: AppStyle.Color.alertColor },
        styleText: {
          color: AppStyle.Color.white
        }
      }
    })
  }
}

export default new NavigationStore()
