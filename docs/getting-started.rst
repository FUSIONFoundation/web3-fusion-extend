
.. include:: include_announcement.rst

===============
Getting Started
===============

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


This package extends the Ethereum compatible JavaScript API which implements the Generic JSON RPC spec to support the Fusion protocol.

It's available on npm as a node module.

NPM version

You need to run a local Ethereum node to use this library.

Documentation



.. _adding-web3:

Installation
============

Node.js

.. code-block:: javascript

    npm install web3-fusion-extend

Yarn

.. code-block:: javascript

    yarn add web3-fusion-extend

Usage
=====
Create a web3 object as your normally would and then call web3FusionExtend with that object. web3 will then have two additional interfaces (fsn and fsntx)

.. code-block:: javascript

    var web3FusionExtend = require('web3-fusion-extend')
    web3 = new Web3(provider);
    web3 = web3FusionExtend.extend(web3)
    console.log(web3.fsn.consts.FSNToken);

.. code-block:: javascript

    console.log(web3); // {fsn: .., fsntx: ...} // It's here!

There you go, now you can use it:

.. code-block:: javascript

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

You can find more examples in the test directory.

There is also a full block explorer api written as an example.

    BlockExplorerApi

Contribute!
===========

We'd greatly appreciate any contribution you make.

Documentation
=============

Documentation

Overview
fsn
fsntx
Constants

Requirements
============

Node.js
npm

.. code-block:: javascript

    # On Linux:
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install npm
    sudo apt-get install nodejs-legacy

Testing (mocha)
===============

When testing a connect string to a local fusion node and a wallet address is needed as environment variables

.. code-block:: javascript

    CONNECT_STRING="ws://3.16.110.25:9001" WALLET_ADDRESS="0x4A5a7Aa4130e407d3708dE56db9000F059200C62" npm test


Community
=========

Gitter
Forum

License
=======

LGPL-3.0+ © 2015 Contributors
