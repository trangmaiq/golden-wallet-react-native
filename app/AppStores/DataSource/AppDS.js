import { AsyncStorage } from 'react-native'

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
    return dataString ? JSON.parse(dataString) : null
  }

  async saveAppData(data) {
    return AsyncStorage.setItem(dataKey, JSON.stringify(data))
  }
}

export default new AppDataSource()