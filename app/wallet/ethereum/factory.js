import Starypto from '../../../Libs/react-native-starypto'

export default class EthWalletFactory {
  mnemonic = null
  currentWalletIndexCreated = 0
  walletsInPool = []
  isCreatingWallets = false
  masterNode = null
  currentChildNode = null

  constructor(mnemonic = null) {
    this.mnemonic = mnemonic
  }

  spamWallets(number = 50) {
    if (this.isCreatingWallets) return

    this.isCreatingWallets = true

    new Promise((ok, reject) => {
      const n = this.walletsInPool.length + number
      while (this.walletsInPool.length < n) {
        const i = this.walletsInPool.length
        const node = this.currentChildNode.derive(i)
        const wallet = Starypto.fromHDNode(node)
        this.walletsInPool.push(wallet)
      }
      ok()
    }).then(() => {
      this.isCreatingWallets = false
    })
  }

  createWallet() {
    const newIndex = this.currentWalletIndexCreated + 1

    if (!this.walletsInPool[newIndex]) {
      return new Promise((ok, reject) => {
        const handler = () => {
          const hasWallet = this.walletsInPool[newIndex]
          // ok: return wallet
          if (hasWallet) {
            this.currentWalletIndexCreated = newIndex
            return ok(this.walletsInPool[newIndex])
          }

          // retry after 300ms
          setTimeout(handler, 300)
        }
      })
    }
    return Promise.resolve(this.walletsInPool[++this.currentWalletIndexCreated])
  }

  getCurrentState() {
    return {
      mnemonic: this.mnemonic
    }
  }

  getCoinType() {
    return Starypto.coinTypes.ETH
  }

  start() {
    const masterNodePromise = (this.mnemonic === null)
      ? Starypto.generateMnemonic()
      : Promise.resolve(Starypto.fromMnemonic(mnemonic))

    masterNodePromise.then(async (masterNode) => {
      this.masterNode = masterNode
      this.mnemonic = masterNode.mnemonic
      this.currentChildNode = masterNode.derivePathWithCoinType(this.getCoinType())
      this.spamWallets(50)
    })
  }


  isReady() {
    return this.masterNode !== null && this.currentChildNode !== null
  }
}