'use strict';

var sha3 = require('js-sha3');
import convert from './convert'
// var convert = require('./convert.js');

function keccak256(data) {
    data = convert.arrayify(data);
    return '0x' + sha3.keccak_256(data);
}

export default keccak256
