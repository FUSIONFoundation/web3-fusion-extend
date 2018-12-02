var web3FusionExtend = require('./lib/web3FusionExtend.js');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.web3FusionExtend === 'undefined') {
    window.web3FusionExtend = web3FusionExtend;
}

module.exports = web3FusionExtend;