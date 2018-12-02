# Fusion JavaScript API

[![Join the chat at https://gitter.im/ethereum/web3.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/web3.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is the Ethereum compatible [JavaScript API](https://github.com/ethereum/wiki/wiki/JavaScript-API)
which implements the [Generic JSON RPC](https://github.com/ethereum/wiki/wiki/JSON-RPC) spec. It's available on npm as a node module, for Bower and component as embeddable scripts, and as a meteor.js package.

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

Use the `web3` object directly from the global namespace:

```js
console.log(web3); // {eth: .., shh: ...} // It's here!
```

Set a provider (`HttpProvider`):

```js
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
```

Set a provider (`HttpProvider` using [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)):

```js
web3.setProvider(new web3.providers.HttpProvider('http://' + BasicAuthUsername + ':' + BasicAuthPassword + '@localhost:8545'));
```

There you go, now you can use it:

```js
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
```

You can find more examples in the [`test`](https://github.com/FusionFoundation//web3-fusion-extend/tree/master/example) directory.


## Contribute!

We'd greatly appreciate any [contribution](/CONTRIBUTING.md) you make.


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
