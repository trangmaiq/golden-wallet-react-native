import { AsyncStorage } from 'react-native'
import AddressBook from '../stores/AddressBook'

const dataKey = 'ADDRESS_BOOKS_STORAGE'

class AddressBookDS {
  AddressBooks = [] // for caching

  async getAddressBooks() {
    const AddressBooksStr = await AsyncStorage.getItem(dataKey)
    if (!AddressBooksStr) return []

    this.AddressBooks = JSON.parse(AddressBooksStr).map(js => new AddressBook(js))
    return this.AddressBooks
  }

  async getAddressBookAtAddress(address) {
    const AddressBooks = this.AddressBooks || await this.getAddressBooks()
    return AddressBooks.find(ab => ab.address === address)
  }

  saveAddressBooks(AddressBooksArray) {
    const addressBooks = AddressBooksArray.map(ab => ab.toJSON())
    return AsyncStorage.setItem(dataKey, JSON.stringify(addressBooks))
  }

  async updateAddressBook(addressBook) {
    const addressBooks = await this.getAddressBooks()

    for (let i = 0; i < addressBooks.length; i++) {
      if (addressBooks[i].address === addressBook.address) {
        addressBooks[i] = addressBook
        this.saveAddressBooks(addressBooks)
        break
      }
    }
  }

  async addNewAddressBook(addressBook) {
    const addressBooks = await this.getAddressBooks()
    const find = addressBooks.find(ab => ab.address === addressBook.address)
    if (!find) addressBooks.push(addressBook)
    return this.saveAddressBooks(addressBooks)
  }

  async deleteAddressBook(address) {
    const addressBooks = await this.getAddressBooks()
    const result = addressBooks.filter(ab => ab.address != address)

    return this.saveAddressBooks(result)
  }
}

export default new AddressBookDS()
