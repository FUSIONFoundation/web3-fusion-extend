.. _fsn-index:

.. web3-fusion-extend documentation master file, created by
   sphinx-quickstart on Wed Feb 13 17:43:14 2019.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Welcome to web3-fusion-extend's documentation!
==============================================


Fusion is an enterprise financial infrastructure blockchain solution simplifying the full digital life of any asset.

With the ethreum world users are familiar that they have a wallet and a balance.
If user own ERC20 or ERC721 tokens wallets applications hide the technicalities of calling contracts to get their values.

Fusion evolutionary approach moves the asset and its balance to the users ethereum wallet.

No contracts are needed as multiple balances each with a unique asset Id can be contained on the chain in the wallet.

Other inflationary practices to code such as creating escrows and atomic swaps are also eliminated by simply having the asset in the users account.

Fusion allows all assets to have time periods, these time periods enable safe lending of an asset.

So a balance of 1 Fusion Token can be Timelocked for 30 days, sent to another account.

At the end of the 30 days that other account no longer can access that value in their wallet.

All done natively on the chain without contracts.

The goal of Fusion is to:

* make assets (tokens) a natural part of send and receive of value
    * eliminate need for ERC20 contracts
    * eliminate need for ERC721 contracts
    * simply the familiar paridigm of from, to, value -> from, to, assetId, value

* introduce the concept of timelock of an asset as a natural wallet feature
    * split the use of any asset into any sliver of time
    * allow that time portion of that asset to be securely lent to someone

* quantum swap - introduce a one transaction method to exchange assets between parties
    * the ability to exchange assets between accounts in one transaction on the blockchain without chance of error
    * assets that are timelocked can be exchanged
    * swaps can be made public to all users or a targeted user.

The purpose of the web3-fusion-extend libary is to take the popular web3.js package and 
open it up to the extended functionallity of that the Fusion blockchain server provides.


Contents:

:ref:`Keyword Index <genindex>`, :ref:`Search Page <search>`

.. toctree::
    :maxdepth: 2
    :caption: User Documentation

    contributing
    getting-started

.. toctree::
    :maxdepth: 2
    :caption: API Reference

    autoPurchaseTickets
    blockexplorerapi
    constants
    fsn
    fsntx
