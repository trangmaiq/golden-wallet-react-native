/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import NotificationListenter from './app/NotificationListener'
import ScreenID from './app/navigation/ScreenID'
import NavigationStore from './app/navigation/NavigationStore'

console.ignoredYellowBox = ['Warning: isMounted']

NotificationListenter.registerKilledListener()
NavigationStore.createSinglePageApp(ScreenID.App)
