import Starypto from './Libs/react-native-starypto'

// {
//   mnemonic,
//   ethIndex: 0,
//   ethWallet: [{
//     name: 'Viet',
//     address: '0x728372187ab'
//     pk: '0x121212'
//   }]
// }

const mnemonic = 'away resist vote symbol forward puppy upon mesh race give escape bamboo'

function generateMasterNode() {
  return Starypto.generateMnemonic().then((masterNode) => {
    console.log(masterNode.mnemonic)
    return masterNode
  })
}

function getMasterNodeFromMnemonic() {
  return Starypto.fromMnemonic(mnemonic)
}

function createNewETHWallet(masterNode, index = 0, network = 'mainnet') {
  const childNode = masterNode.derivePathWithCoinType(Starypto.coinTypes.ETH).derive(index)
  const wallet = Starypto.fromHDNode(childNode, network)
  console.log('New ETH Wallet: ', wallet.address, wallet.privateKey, wallet.publicKey)
  return wallet
}

function createNewETHWalletTest(masterNode, index = 0, network = 'mainnet') {
  masterNode.derivePathWithCoinTypeAsync(Starypto.coinTypes.ETH)
    .then(node => node.derive(index))
    .then(node => Starypto.fromHDNode(node, network))
}

function getETHWalletWithAddress(address, network = 'mainnet') {
  return new Starypto.Wallet({ coinType: Starypto.coinTypes.ETH, network }, null, address)
}

/*
  Network: string (mainnet || ropsten || rinkeby || kovan)
  privateKey: string
*/
function importETHWalletFromPrivateKey(privateKey, network = 'mainnet') {
  const walletETHFromPK = Starypto.fromPrivateKey(privateKey, Starypto.coinTypes.ETH, network)
  console.log('Import ETH Wallet from PrivateKey: ', walletETHFromPK.address, walletETHFromPK.privateKey, walletETHFromPK.publicKey)
  return walletETHFromPK
}

// wallet: {
//   address: 03903904,
//   privateKey: eiheihfeihfi,
//   publictKey: efheufheuf
// }

function getETHWalletBalance(wallet) {
  wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
  wallet.getBalance().then((res) => {
    console.log(`${wallet.address} Balance:`, Starypto.Units.formatEther(res))
  })
}

function canSendTransaction(wallet) {
  return wallet.canSendTransaction()
}

function sendTransaction(wallet, toAddress, ethString = '0.001') {
  const transaction = {
    to: toAddress,
    value: Starypto.Units.parseEther(ethString)
  }

  wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')
  wallet.provider.estimateGas(transaction).then((res) => {
    transaction.gasLimit = res
    wallet.sendTransaction(transaction).then(tx => console.log(tx))
  })
}

function hashPassword(password) {
  return Starypto.hashPassword(password)
}

/**
  import { randomBytes } from 'react-native-randombytes'

  @example
  let data = {
    Mnemonic: "strong dad page loud fence increase can major knock dinosaur pilot jeans"
    PrivateKey: "0xfeaec43f655ff69cd57971f821f809efd9b8e96f031664ae74172f7fa2fd943a",
    PublicKey: "0x02b22f81e6a4adaaf3d913ae8c51571c20804e2b13f1a78eb892da8e8f1d745568",
    Address: "0x477B8B29849A7e1B46Ff13DD5E89C13d4060752c"
  }

  dataString = JSON.stringify(data)
  // Generate iv ( MUST STORE IV )
  const iv = randomBytes(16).toString('hex').slice(0, 16)
**/

function encryptDataAES256(dataString, password, iv, algorithm = 'aes-256-cbc') {
  // dataEncrypted:
  return Starypto.encryptString(dataString, password, iv, algorithm)
}

function decryptDataAES256(dataEncrypted, password, iv, algorithm = 'aes-256-cbc') {
  // dataDecrypted:
  return Starypto.decryptString(dataEncrypted, password, iv, algorithm)
}

function sendERC20Token(
  tokenAddress = '0xf230b790E05390FC8295F4d3F60332c93BEd42e2',
  toAddress = '0x929a19641205817ecf9d7c17194fcb7ab656276f',
  valueStr = '1.0',
  wallet
) {
  Starypto.ContractUtils.parseContract(tokenAddress)
    .then((contract) => {
      // set provider if not set
      wallet.initProvider('Infura', 'qMZ7EIind33NY9Azu836')

      // Calculate value token to send
      const numberOfDecimals = contract.tokenInfo.decimals
      const numberOfTokens = Starypto.Units.parseUnits(valueStr, numberOfDecimals)

      const ct = new Starypto.Contract(tokenAddress, contract.abi, wallet)
      // tx is transaction hash
      ct.transfer(toAddress, numberOfTokens).then(tx => console.log(tx))
    })
}

function getNEOWalletBalance(wallet) {
  wallet.initProvider('CityOfZion')
  wallet.getBalance().then((res) => {
    console.log(`${wallet.address} NEO: ${res.NEO.balance} ; GAS: ${res.GAS.balance}`)
  })
}

/**
 * @param
 * const transaction = {
  to: 'AKcvyzZVTgv5EC9h4FS5Mjsxbr1VwmysNx', (toAddress)
  value: 0.1,
  assetName: 'GAS' || 'NEO'
}

return last transaction ID
*/

function sendNEOTransaction(wallet, transaction) {
  wallet.initProvider('CityOfZion')
  wallet.sendTransaction(transaction).then((res) => {
    console.log(res)
  })
}

export default {
  mnemonic,
  generateMasterNode,
  getMasterNodeFromMnemonic,
  createNewETHWallet,
  getETHWalletWithAddress,
  importETHWalletFromPrivateKey,
  getETHWalletBalance,
  canSendTransaction,
  sendTransaction,
  encryptDataAES256,
  decryptDataAES256,
  hashPassword,
  sendERC20Token,
  getNEOWalletBalance,
  sendNEOTransaction,
  createNewETHWalletTest
}
