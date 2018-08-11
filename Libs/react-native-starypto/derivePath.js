export default class DerivePath {
  purpose = 44
  coinType = 0
  account = 0
  change = 0
  addressIndex = 0
  node = null

  get path() {
    return `m/${purpose}'/${coinType}'/${account}'/${change}`
  }

  constructor(path, node) {
    const { purpose, coinType, account, change, addressIndex } = this.parsePath(path)
    this.purpose = purpose
    this.coinType = coinType
    this.account = account
    this.change = change
    this.addressIndex = addressIndex
    this.node = node
  }

  parsePath = (path) => {
    let splitPath = path.split('/')
    if (splitPath[0] !== 'm') {
      throw new Error('Not a valid path 0')
    }
    splitPath = splitPath.slice(1)

    if (splitPath[0].slice(-1) !== "'") throw new Error('Not a valid path 1')
    const purpose = parseInt(splitPath[0].slice(0, -1), 10)

    splitPath = splitPath.slice(1)
    if (splitPath[0].slice(-1) !== "'") throw new Error('Not a valid path 2')
    const coinType = parseInt(splitPath[0].slice(0, -1), 10)

    splitPath = splitPath.slice(1)
    if (splitPath[0].slice(-1) !== "'") throw new Error('Not a valid path 3')
    const account = parseInt(splitPath[0].slice(0, -1), 10)

    splitPath = splitPath.slice(1)
    const change = parseInt(splitPath[0], 10)

    return { purpose, coinType, account, change, addressIndex: 0 }
  }

  // static getPath(coinType, network) {
  //   const path = new DerivePath(coinType.path)
  // }
}