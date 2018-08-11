import { observable, action } from 'mobx'
import { AsyncStorage } from 'react-native'
import NavigationStore from '../navigation/NavigationStore'

class ContactStore {
  constructor() {
    this.getContacts()
  }

  @observable contacts = []

  @action getContacts() {
    const promiseItem = AsyncStorage.getItem('CONTACTS_LIST')
    promiseItem.then((dataStr) => {
      this.contacts = JSON.parse(dataStr) || []
    }, (error) => {
      console.log(error)
    })
  }

  @action addContact({ name, address }) {
    const item = {
      name,
      address
    }
    this.contacts.push(item)
    try {
      AsyncStorage.setItem('CONTACTS_LIST', JSON.stringify(this.contacts))
    } catch (error) {
      throw error
    }
  }

  @action removeContact({ name, address }) {
    const index = this.contacts.findIndex((item) => {
      return item.name === name && item.address === address
    })
    if (index > -1) {
      this.contacts.splice(index, 1)
      try {
        AsyncStorage.setItem('CONTACTS_LIST', JSON.stringify(this.contacts))
      } catch (error) {
        NavigationStore.showPopup('Cannot delete this contact')
      }
    }
  }

  @action editContact(item, index) {
    this.contacts[index] = item
    try {
      AsyncStorage.setItem('CONTACTS_LIST', JSON.stringify(this.contacts))
    } catch (error) {
      throw error
    }
  }
}

const contactStore = new ContactStore()
export default contactStore
