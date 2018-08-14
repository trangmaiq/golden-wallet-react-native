import { AsyncStorage } from 'react-native'
import AppState from '../AppState'

const dataKey = 'APP_STORAGE'

// {
//   dataVersion: 1,
//   config: { network: 'mainnet', ...},
//   defaultWallet: {...},
//   selectedWallet: {...},
//   selectedToken: {...},
//   wallets: [{...},{...},...],
//   addressBooks: [{...},{...},...]
// }

// Store all configs app data
class AppDataSource {
  async readAppData() {
    const dataString = await AsyncStorage.getItem(dataKey)
    if (!dataString) return AppState
    const data = JSON.parse(dataString)
    await AppState.import(data)
    return AppState
  }

  async saveAppData(data) {
    return AsyncStorage.setItem(dataKey, JSON.stringify(data))
  }
}

export default new AppDataSource()
