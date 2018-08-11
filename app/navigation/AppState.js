import { AppState } from 'react-native'

class StateListener {
  constructor() {
    this.currentState = 'active'
  }

  _handleAppStateChange = (nextAppState) => {
    setTimeout(() => {
      this.currentState = nextAppState
    }, 100)
  }

  start() {
    AppState.addEventListener('change', this._handleAppStateChange)
  }
}

export default new StateListener()
