import { observable, action, computed } from 'mobx'

export default class AmountStore {
  @observable value = 0
  @observable currency = '$' // $ | ETH | Token Symbol

  @observable rate = 1

  constructor({ currency = '$', rate = 1 }) {
    this.currency = currency
    this.rate = rate
  }

  @computed get currentValue() {
    switch (this.currency) {
      case '$': {
        return this.value * this.rate
      }
      default: return this.value / this.rate
    }
  }

  @computed get valueFormatted() {
    return this.currentValue + this.currency
  }
}
