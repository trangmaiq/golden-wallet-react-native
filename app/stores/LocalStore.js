import { AsyncStorage } from 'react-native'

class LocalStore {
  /**
   *
   * @param {string} key
   * @param {object} item
   */
  async saveItem(key, item) {
    AsyncStorage.setItem(key, JSON.stringify(item))
  }

  /**
   *
   * @param {string} key
   * @param {function} callback
   * @param {function} error
   */
  getItems(key, callback = (item) => { }, error = (e) => { }) {
    AsyncStorage.getItem(key).then((response) => {
      let item = null
      if (response) {
        item = JSON.parse(response)
      }
      callback(item)
    }).catch((e) => {
      error(e)
    })
  }
}

export default new LocalStore()
