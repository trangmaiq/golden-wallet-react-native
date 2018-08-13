import { observable } from 'mobx'
import AddressBookDS from '../DataSource/AddressBookDS'

const defaultObjWallet = {
  title: '',
  address: '',
  type: 'ethereum'
}

export default class AddressBook {
  @observable title = ''
  @observable address = ''

  static createNew(title, address) {
    return new AddressBook({ title, address })
  }

  constructor(obj) {
    const initObj = Object.assign({}, defaultObjWallet, obj)
    Object.keys(initObj).forEach((k) => {
      this[k] = initObj[k]
    })
  }

  async save() {
    await AddressBookDS.addNewAddressBook(this)
  }

  async update() {
    await AddressBookDS.updateAddressBook(this)
  }

  async delete() {
    await AddressBookDS.deleteAddressBook(this.address)
  }

  toJSON() {
    const { title, address, type } = this
    return {
      title, address, type
    }
  }
}
