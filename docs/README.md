
# web3-fusion-extend.js - Fusion JavaScript API

### Overview

web3-fusion-extend is a collection of libraries which allow you to interact with a local or remote fusion node,
using a HTTP or IPC connection.

Fusion offers a radical approach to representing value within a block chain environment.

A public address contain multiple assets and balances for these assets.

An assetId is the id returned when an asset is created and actions can be performed on it.

The asset creator also has the ability to increase and decrease supply.

This enables cross chain and cross functional systems to be built that enable the interchange of assets.

Assets can also be TimeLocked.  When an asset is time locked its ownership is leant for the period specified.
At the end of time lock period the rights of the asset are returned to the original owner.

With the representation of assets, the need to exchange assets securely and simply becomes paramount.

The Fusion protocol introduces quantumSwaps which are composed of three functions:
        makeSwap - tell others what you will exchange for your asset
        recallSwap - cancel the request for an exchange
        takeSwap - exchange your asset for the other parties asset listed in the make swap


To get started with the web3-fusion-extend package

## Installation

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


### Documentation of extensions

 - [fsn](./FSN.md)
 - [fsntx](./FSNTX.md)
 - [Constants](./FSNCONSTANTS.md)
