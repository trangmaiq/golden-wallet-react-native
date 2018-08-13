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
      return w.title.toLowerCase() === name.toLowerCase()
    })
    return isExist
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
