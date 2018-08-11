import WalletStore from '../stores/WalletStore'

class Checker {
  static checkAddress(address) {
    const regx = /0x[0-9A-Fa-f]{40}/
    return address.match(regx)
  }
  static checkPrivateKey(key) {
    return key.length === 64
  }
  static checkWalletIsExist(wallets, address) {
    const isExist = wallets.find((w) => {
      return w.address.toLowerCase() === address.toLowerCase()
    })
    return isExist
  }
  static checkNameIsExist(wallets, name) {
    const isExist = wallets.find((w) => {
      return w.cardName.toLowerCase() === name.toLowerCase()
    })
    return isExist
  }

  static checkExistName(name, index) {
    const wallets = WalletStore.dataCards
    for (let i = 0; i < wallets.length; i++) {
      if (i !== index) {
        if (wallets[i].cardName === name) {
          return true
        }
      }
    }
    return false
  }

  static async checkInternet() {
    let probablyHasInternet = false
    try {
      const googleCall = await fetch('https://google.com')
      probablyHasInternet = googleCall.status === 200
    } catch (e) {
      probablyHasInternet = false
    }
    return probablyHasInternet
  }
}

export default Checker
