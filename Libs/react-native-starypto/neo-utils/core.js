import {
  hexstring2ab,
  ab2hexstring,
  reverseArray,
  numStoreInMemory
} from './convert'
import CryptoJS from 'crypto-js'
import base58 from 'bs58'

import { ec } from 'elliptic'
const Buffer = require('buffer').Buffer
import { ASSEST_IDS } from './const'

export const createSignatureScript = ($publicKeyEncoded) => {
  return "21" + $publicKeyEncoded.toString('hex') + "ac";
};
export const addContract = ($txData, $sign, $publicKeyEncoded) => {
  var signatureScript = createSignatureScript($publicKeyEncoded);
  // console.log(signatureScript);
  // sign num
  var data = $txData + "01";
  // sign struct len
  data = data + "41";
  // sign data len
  data = data + "40";
  // sign data
  data = data + $sign;
  // Contract data len
  data = data + "23";
  // script data
  data = data + signatureScript;
  // console.log(data);
  return data;
};

export const getHash = ($SignatureScript) => {
  var ProgramHexString = CryptoJS.enc.Hex.parse($SignatureScript);
  var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  return CryptoJS.RIPEMD160(ProgramSha256);
};

export const signatureData = ($data, $privateKey) => {
  var msg = CryptoJS.enc.Hex.parse($data);
  var msgHash = CryptoJS.SHA256(msg);
  const msgHashHex = new Buffer(msgHash.toString(), "hex")
  const privateKeyHex = new Buffer($privateKey, "hex");

  var elliptic = new ec('p256');
  const sig = elliptic.sign(msgHashHex, $privateKey, null);
  const signature = {
    signature: Buffer.concat([
      sig.r.toArrayLike(Buffer, 'be', 32),
      sig.s.toArrayLike(Buffer, 'be', 32)
    ])
  }
  return signature.signature.toString('hex');
};

export const getInputData = ($coin, $amount) => {
  // sort
  var coin_ordered = $coin['list'];
  for (let i = 0; i < coin_ordered.length - 1; i++) {
    for (let j = 0; j < coin_ordered.length - 1 - i; j++) {
      if (parseFloat(coin_ordered[j].value) < parseFloat(coin_ordered[j + 1].value)) {
        var temp = coin_ordered[j];
        coin_ordered[j] = coin_ordered[j + 1];
        coin_ordered[j + 1] = temp;
      }
    }
  }

  // calc sum
  var sum = 0;
  for (let i = 0; i < coin_ordered.length; i++) {
    sum = sum + parseFloat(coin_ordered[i].value);
  }

  // if sum < amount then exit;
  var amount = parseFloat($amount);
  if (sum < amount) return -1;

  // find input coins
  var k = 0;
  var needed = 0.0;
  while (needed < amount) {
    needed = needed + parseFloat(coin_ordered[k].value)
    k = k + 1;
  }

  /////////////////////////////////////////////////////////////////////////
  // coin[0]- coin[k]
  var data = new Uint8Array(1 + 34 * (k));

  // input num
  var inputNum = numStoreInMemory((k).toString(16), 2);
  data.set(hexstring2ab(inputNum));

  // input coins
  for (var x = 0; x < k; x++) {

    // txid
    var pos = 1 + (x * 34);
    data.set(reverseArray(hexstring2ab(coin_ordered[x]['txid'])), pos);
    //data.set(hexstring2ab(coin_ordered[x]['txid']), pos);

    // index
    pos = 1 + (x * 34) + 32;
    let inputIndex = numStoreInMemory(coin_ordered[x]['index'].toString(16), 4);
    //inputIndex = numStoreInMemory(coin_ordered[x]['n'].toString(16), 2);
    data.set(hexstring2ab(inputIndex), pos);
  }

  /////////////////////////////////////////////////////////////////////////

  // calc coin_amount
  var coin_amount = 0;
  for (let i = 0; i < k; i++) {
    coin_amount = coin_amount + parseFloat(coin_ordered[i].value);
  }

  /////////////////////////////////////////////////////////////////////////

  return {
    amount: coin_amount,
    data: data
  }
};

// TODO: important, requires significant documentation
// all of these arguments should be documented and made clear, what $coin looks like etc.
// also, remove $ variable names, most likey
export const transferTransaction = ($coin, $publicKeyEncoded, $toAddress, $Amount) => {
  var ProgramHash = base58.decode($toAddress);
  var ProgramHexString = CryptoJS.enc.Hex.parse(ab2hexstring(ProgramHash.slice(0, 21)));
  var ProgramSha256 = CryptoJS.SHA256(ProgramHexString);
  var ProgramSha256_2 = CryptoJS.SHA256(ProgramSha256);
  var ProgramSha256Buffer = hexstring2ab(ProgramSha256_2.toString());

  if (ab2hexstring(ProgramSha256Buffer.slice(0, 4)) != ab2hexstring(ProgramHash.slice(21, 25))) {
    //address verify failed.
    throw new Error('Verify Address Failed.');
  }

  ProgramHash = ProgramHash.slice(1, 21)

  var signatureScript = createSignatureScript($publicKeyEncoded);
  var myProgramHash = getHash(signatureScript);
  // INPUT CONSTRUCT
  var inputData = getInputData($coin, $Amount);
  if (inputData == -1) throw new Error("Not Enough Balance For This Transaction.");
  // console.log('wallet inputData', inputData );

  var inputLen = inputData.data.length;
  var inputAmount = inputData.amount;

  // console.log(inputLen, inputAmount, $Amount);
  // Set SignableData Len
  var signableDataLen = 124 + inputLen;
  if (inputAmount == $Amount) {
    signableDataLen = 64 + inputLen;
  }

  // CONSTRUCT
  var data = new Uint8Array(signableDataLen);

  // type
  data.set(hexstring2ab("80"), 0);

  // version
  data.set(hexstring2ab("00"), 1);

  // Attributes
  data.set(hexstring2ab("00"), 2);

  // INPUT
  data.set(inputData.data, 3);

  // OUTPUT
  if (inputAmount == $Amount) {
    // only one output

    // output num
    data.set(hexstring2ab("01"), inputLen + 3);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab($coin['assetid'])), inputLen + 4);
    //data.set(hexstring2ab($coin['assetid']), inputLen + 4);

    // output value
    const num1 = parseInt($Amount * 100000000);
    const num1str = numStoreInMemory(num1.toString(16), 16);
    data.set(hexstring2ab(num1str), inputLen + 36);

    // output ProgramHash
    data.set(ProgramHash, inputLen + 44);

    ////////////////////////////////////////////////////////////////////

  } else {

    // output num
    data.set(hexstring2ab("02"), inputLen + 3);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 0

    // output asset
    data.set(reverseArray(hexstring2ab($coin['assetid'])), inputLen + 4);
    //data.set(hexstring2ab($coin['assetid']), inputLen + 4);

    // output value
    const num1 = parseInt($Amount * 100000000);
    const num1str = numStoreInMemory(num1.toString(16), 16);
    data.set(hexstring2ab(num1str), inputLen + 36);

    // output ProgramHash
    data.set(ProgramHash, inputLen + 44);

    ////////////////////////////////////////////////////////////////////
    // OUTPUT - 1

    // output asset
    data.set(reverseArray(hexstring2ab($coin['assetid'])), inputLen + 64);
    //data.set(hexstring2ab($coin['assetid']), inputLen + 64);

    // output value
    const num2 = parseInt(inputAmount * 100000000 - num1);
    const num2str = numStoreInMemory(num2.toString(16), 16);
    data.set(hexstring2ab(num2str), inputLen + 96);

    // output ProgramHash
    data.set(hexstring2ab(myProgramHash.toString()), inputLen + 104);

    ////////////////////////////////////////////////////////////////////

    //console.log( "Signature Data:", ab2hexstring(data) );
  }

  return ab2hexstring(data);
};

/* SEND ASSET TRANSACTION
 Param {net} : string  - 'mainnet' or 'testnet'
 Param {assetName}: string - 'NEO' or 'GAS'
 Param {toAddress}: string - Address will be received asset
 Param {fromAccount}: { publicKey, privateKey } - Account send asset (contains `publicKey` and `privateKey`)
 Param {ammount}: Number - Amount asset
 Return Promise <RPCResponse> - Example { jsonrpc : "2.0", result: true } (Object)
*/

export const getRawAssetTransaction = (net, toAddress, fromAccount, amount, coinsData) => {
  const txData = transferTransaction(coinsData, fromAccount.publicKey, toAddress, amount)
  const sign = signatureData(txData, fromAccount.privateKey)
  return addContract(txData, sign, fromAccount.publicKey)
  // return queryRPC(net, 'sendrawtransaction', [txRawData], 15)
}
