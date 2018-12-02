# Fusion JavaScript API

This package extends the Ethereum compatible [JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
which implements the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec to support the Fusion protocol.

It's available on npm as a node module.

[![NPM version][npm-image]][npm-url] 

You need to run a local Ethereum node to use this library.

[Documentation](https://github.com/ethereum/wiki/wiki/JavaScript-API)

## Table of Contents

- [Installation](#installation)
  - [Node.js](#nodejs)
  - [Yarn](#yarn)
- [Usage](#usage)
- [Contribute!](#contribute)
  - [Requirements](#requirements)
  - [Testing (mocha)](#testing-mocha)
  - [Community](#community)
- [License](#license)

## Installation

### Node.js

```bash
npm install web3-fusion-extend
```

### Yarn

```bash
yarn add web3-fusion-extend
```

## Usage

Create a web3 object as your normally would and then call web3FusionExtend with that object.
web3 will then have two additional interfaces (fsn and fsntx)

```
    web3 = new Web3(provider);
    web3 = web3FusionExtend.extend(web3)
    console.log(web3.fsn.consts.FSNToken);
```

```js
console.log(web3); // {fsn: .., fsntx: ...} // It's here!
```

There you go, now you can use it:

```js
var balance = web3.eth.getBalance(coinbase);
   web3.fsn
        .getAllBalances( web3.eth.coinbase ) // fsn supports multiple assets and balances on an address
        .then( balances => {
          console.log( balances )
          assert(  balances[web3.fsn.consts.FSNToken] , "there should be a balance for fusion tokens always"  )
          done();
        })
        .catch(err => {
          done(err);
        });
```

You can find more examples in the [`test`](https://github.com/FusionFoundation//web3-fusion-extend/tree/master/test) directory.


## Contribute!

We'd greatly appreciate any [contribution](/CONTRIBUTING.md) you make.

## Documentation

Documentation can be found at [read the docs][docs]

 - [Overivew] (docs/oveview.)


### Requirements

* Node.js
* npm

```bash
# On Linux:
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
```


### Testing (mocha)

```bash
npm test
```

### Community
 - [Gitter](https://gitter.im/ethereum/web3.js?source=orgpage)
 - [Forum](https://forum.ethereum.org/categories/ethereum-js)



## License

[LGPL-3.0+](LICENSE.md) © 2015 Contributors


[npm-image]: https://badge.fury.io/js/web3.svg
[npm-url]: https://npmjs.org/package/web3-fusion-extend
