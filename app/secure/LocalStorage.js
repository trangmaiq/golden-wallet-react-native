import { AsyncStorage } from 'react-native'

class LocalStorage {
  saveItem = async (key, value) => {
    await AsyncStorage.setItem(key, value)
  }

  getItem = async (key) => {
    const dataLocal = await AsyncStorage.getItem(key)
    return dataLocal
  }
}

const localStorage = new LocalStorage()
export default localStorage
