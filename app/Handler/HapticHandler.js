import ReactNativeHapticFeedback from 'react-native-haptic-feedback'

export default {
  Selection: () => { ReactNativeHapticFeedback.trigger('selection', true) },
  ImpactLight: () => { ReactNativeHapticFeedback.trigger('impactLight', true) },
  ImpactMedium: () => { ReactNativeHapticFeedback.trigger('impactMedium', true) },
  ImpactHeavy: () => { ReactNativeHapticFeedback.trigger('impactHeavy', true) },
  NotificationSuccess: () => { ReactNativeHapticFeedback.trigger('notificationSuccess', true) },
  NotificationWarning: () => { ReactNativeHapticFeedback.trigger('notificationWarning', true) },
  NotificationError: () => { ReactNativeHapticFeedback.trigger('notificationError', true) }
}
