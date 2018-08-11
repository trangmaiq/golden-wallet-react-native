import { getAddress } from './address'
import keccak256 from './keccak256'
import Convert from './convert'

export default {
  getAddress,
  keccak256,
  ...Convert,
  RLP: require('./rlp')
}
