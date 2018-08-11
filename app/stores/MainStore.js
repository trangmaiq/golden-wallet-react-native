// import Config from './config'
import { observable, action } from 'mobx'
import EventDispatcher from './EventDispatcher'

class MainStore {
  @observable config = null
  @observable unspendTransaction = null
  @observable wallets = []
  appEvent = new EventDispatcher()

  // Start
  @action startApp() {
    Promise.all([
      this.getConfig(),
      this.checkPinCode()
    ]).then(([config, hasPinCode]) => {
      this.config = config

      if (!hasPinCode) this.appEvent.dispatch('EvtUserHasNotPinCode')
    })
  }

  checkPinCode() {
    return Promise.resolve(false)
  }

  @action getConfig() {
    // return Config.GetConfig()
  }

  @action changeConfig(config) {
    this.config = config
  }
}

export default new MainStore()
