import { observable, action } from 'mobx'
import LocalStore from './LocalStore'
import Network from '../Network'
import AddressTokenStore from './AddressTokenStore'
import TransactionStore from './TransactionStore'

const KEYLOCAL = 'NETWORK_KEY_SAVED'

class NetworkStore {
  @observable networks = [
    { name: Network.MainNet, isChoose: true },
    { name: Network.Ropsten, isChoose: false },
    { name: Network.Rinkeby, isChoose: false },
    { name: Network.Koval, isChoose: false }
  ]
  @observable currentNetwork = Network.MainNet
  @observable switchingNetwork = false

  getNetworkCapitalize() {
    return this.currentNetwork.charAt(0).toUpperCase() + this.currentNetwork.slice(1)
  }

  constructor() {
    this.getLocalNetworks()
  }

  @action setSwitchingNetwork(isSwitch) {
    this.switchingNetwork = isSwitch
  }

  @action getLocalNetworks() {
    this.currentNetwork = Network.MainNet
    // LocalStore.getItems(KEYLOCAL, (item) => {
    //   if (item) {
    //     this.networks = item
    //     this.currentNetwork = this.networks.filter(network => network.isChoose)[0].name
    //   } else {
    //     LocalStore.saveItem(KEYLOCAL, this.networks)
    //   }
    // }, (error) => {
    //   console.log(error)
    // })
  }

  @action changeNetwork(choosenNetwork, index) {
    this.currentNetwork = choosenNetwork
    for (let i = 0; i < this.networks.length; i++) {
      this.networks[i].isChoose = false
    }
    this.networks[index].isChoose = true
    LocalStore.saveItem(KEYLOCAL, this.networks)
    AddressTokenStore.reset()
    TransactionStore.reset()
  }
}

export default new NetworkStore()
