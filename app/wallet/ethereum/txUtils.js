import BN from 'bn.js'
import Starypto from '../../../Libs/react-native-starypto'

const units = {
  wei: [1, 18],
  kwei: [3, 15],
  mwei: [6, 12],
  gwei: [9, 9],
  szabo: [12, 6],
  finny: [15, 3],
  ether: [18, 1]
}

export function isHexString(str) {
  return typeof str === 'string' && str.match(/^0x[0-9A-Fa-f]*$/)
}

export function dropOx(str) {
  if (!str) return '0'
  if (isHexString(str)) return str.substring(2)

  return str
}

export function toBigNumber(val) {
  if (BN.isBN(val)) return val
  if (isHexString(val)) return new BN(dropOx(val), 16)
  else if (typeof val.toNumber !== 'function') return new BN(val)
  return val
}

export function fromWei(wei, unitName = 'ether') {
  if (!units[unitName]) throw new Error('Unit name unsupported.')
  return Starypto.Units.formatUnits(toBigNumber(wei), units[unitName][0])
}

export function fromEther(ether, unitName = 'wei') {
  if (!units[unitName]) throw new Error('Unit name unsupported.')
  return Starypto.Units.parseUnits(ether, units[unitName][1])
}

export function toHexString(val) {
  return `0x${toBigNumber(val).toString(16)}`
}

export default {
  isHexString,
  dropOx,
  fromWei,
  fromEther,
  toHexString,
  toBigNumber
}
