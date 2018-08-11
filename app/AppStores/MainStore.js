import { observable, action } from 'mobx'

class MainStore {
  @observable appState = null
  sendTransaction = null

  // Start
  @action startApp() {
    Promise.all([
      // this.getConfig(),
      // this.checkPinCode()
    ]).then(([config, hasPinCode]) => {
    })
  }

  goToSendTx() {
    this.sendTransaction = new Object()
  }
}

export default new MainStore()