import ApiCaller from './api-caller'

class TransactionDetailAPI {
  getBalanceToken(address, token) {
    return ApiCaller.get(`http://wallet.skylab.vn/balance/${address}/${token === address ? 'eth' : token}`)
  }
}

export default new TransactionDetailAPI()
