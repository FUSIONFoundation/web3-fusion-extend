.. _blockexplorerapi:

================
blockexplorerapi
================

web3-fusion-extend.js - Fusion JavaScript API
=============================================

Overview
--------

This block explorer api section shows how to collect all information from the fusion block chain and update a mysql database.

You will need a node for the application readAllBlocksToDatabase.js to communicate with as well as a mysql database to store the information.

You will need an environment string called DB_CONNECT_STRING

It can be passed on the command line.

.. code-block:: javascript
    
    DB_CONNECT_STRING="{'host':'mysqlserver,'user':'adminuser','password':'password','database':'fusionblockdb','connectionLimit':100}" node readAllBlocksToDatabase.js 

You can then host the api server for the database via:

.. code-block:: javascript

    DB_CONNECT_STRING="{'host':'mysqlserver,'user':'adminuser','password':'password','database':'fusionblockdb','connectionLimit':100}" nodemon   node ./bin/www



Fusion Org and its public explorer api
--------------------------------------

Fusion organization keeps an api endpoint open at `https://api.fusionnetwork.io <https://api.fusionnetwork.io>`_ to assist in application development

You can try commands like `https://api.fusionnetwork.io/blocks/latest <https://api.fusionnetwork.io/blocks/latest>`_ or `https://api.fusionnetwork.io/transactions/latest <https://api.fusionnetwork.io/transactions/latest>`_

Note if you are not a developer the results may look scary but they are the actual last block or transaction info

Installation
------------

.. code-block:: javascript

    npm install


API Commands
------------

If running locally replace api.fusionnetwork.io with your own server link

------
Assets
------
- `http://api.fusionnetwork.io/assets/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae <http://api.fusionnetwork.io/assets/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae>`_
- `http://api.fusionnetwork.io/assets/all?page=0&size=2&sort=desc <http://api.fusionnetwork.io/assets/all?page=0&size=2&sort=desc>`_


-------
Balance
-------

- `http://api.fusionnetwork.io/balances/0xC4A9441afB052cB454240136CCe71Fb09316EA94 <http://api.fusionnetwork.io/balances/0xC4A9441afB052cB454240136CCe71Fb09316EA94>`_
- `http://api.fusionnetwork.io/balances/all?page=0&size=2&sort=asc <http://api.fusionnetwork.io/balances/all?page=0&size=2&sort=asc>`_

------
Blocks
------

- `http://api.fusionnetwork.io/blocks/latest <http://api.fusionnetwork.io/blocks/latest>`_
- `http://api.fusionnetwork.io/blocks/300 <http://api.fusionnetwork.io/blocks/300>`_

- `http://api.fusionnetwork.io/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc <http://api.fusionnetwork.io/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc>`_
- `http://api.fusionnetwork.io/blocks/range?to=10&from=100 <http://api.fusionnetwork.io/blocks/range?to=10&from=100>`_

fields can be: [ timestamp, hash , numberOfTransactions, height ]

-----
Swaps
-----

- `http://api.fusionnetwork.io/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae <http://api.fusionnetwork.io/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae>`_
- `http://api.fusionnetwork.io/swaps/all?page=0&size=2&sort=asc <http://api.fusionnetwork.io/swaps/all?page=0&size=2&sort=asc>`_

------------
Transactions
------------

- `http://api.fusionnetwork.io/transactions/latest <http://api.fusionnetwork.io/transactions/latest>`_
- `http://api.fusionnetwork.io/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa <http://api.fusionnetwork.io/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa>`_
- `http://api.fusionnetwork.io/transactions/all?sort=asc&page=2&size=10&field=height <http://api.fusionnetwork.io/transactions/all?sort=asc&page=2&size=10&field=height>`_

fields can be: [ timestamp, hash , type, block , asset ]

Return an array of transactions from a - seperated array 
- `http://api.fusionnetwork.io/transactions/ts?ts=address1-address2 <http://api.fusionnetwork.io/transactions/ts?ts=address1-address2>`_

------------
Fusion Price
------------

- last price 
    - `http://api.fusionnetwork.io/fsnprice <http://api.fusionnetwork.io/fsnprice>`_

- historical prices 
    - `http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=asc <http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=asc>`_

- last two prices 
    - `http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=desc <http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=desc>`_


Search
------

- `http://api.fusionnetwork.io/search/[block,blockhash,transaction,address] <http://api.fusionnetwork.io/search/[block,blockhash,transaction,address]>`_

- `miner leaderboard http://api.fusionnetwork.io/leaderboard <http://api.fusionnetwork.io/leaderboard>`_

- Ticket purchase applicaton
    - `autoPurchaseTicket.js <https://github.com/FUSIONFoundation/web3-fusion-extend/blob/master/examples/autoPurchaseTickets/autoPurchaseTicket.js>`_

Example: node autoPurchaseTicket --c"wss://example.com" -p "./password.txt" -k "./keystore.key" -n 10

.. code-block:: javascript

          -c --connectString web socket gateway to connect to
          -k  --keyStore keystore file to use
          -p  --passPharseFile key file
          -n  --Number of tickets to purchase