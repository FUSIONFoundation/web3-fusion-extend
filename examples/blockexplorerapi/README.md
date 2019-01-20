
# web3-fusion-extend.js - Fusion JavaScript API
# Block Explorer API 

### Overview

This block explorer api section shows how to collect all information 
from the fusion block chain and update a mysql database.

You will need a node for the application readAllBlocksToDatabase.js to communicate with
as well as a mysql database to store the information.

You will need an environment string called DB_CONNECT_STRING

It can be passed on the command line.

```
DB_CONNECT_STRING="{'host':'mysqlserver,'user':'adminuser','password':'password','database':'fusionblockdb','connectionLimit':100}" node readAllBlocksToDatabase.js 
```

You can then host the api server for the database via:

```
DB_CONNECT_STRING="{'host':'mysqlserver,'user':'adminuser','password':'password','database':'fusionblockdb','connectionLimit':100}" nodemon   node ./bin/www
```

# Fusion Org and its public explorer api 

Fusion organization keeps an api endpoint open at https://api.fusionnetwork.io to assist in application development

You can try commands like https://api.fusionnetwork.io/blocks/latest  or https://api.fusionnetwork.io/transactions/latest

Note if you are not a developer the results may look scary but they are the actual last block or transaction info

## Installation

```bash
npm install
```

## API Commands

If running locally replace api.fusionnetwork.io with your own server link

#Assets

  http://api.fusionnetwork.io/assets/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
  http://api.fusionnetwork.io/assets/all?page=0&size=2&sort=desc

#Balance

  http://api.fusionnetwork.io/balances/0xC4A9441afB052cB454240136CCe71Fb09316EA94
  http://api.fusionnetwork.io/balances/all?page=0&size=2&sort=asc

#Blocks

  http://api.fusionnetwork.io/blocks/latest
  http://api.fusionnetwork.io/blocks/300

  http://api.fusionnetwork.io/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc
  http://api.fusionnetwork.io/blocks/range?to=10&from=100

  fields can be:  [ timestamp, hash , numberOfTransactions, height ]

#Swaps

 http://api.fusionnetwork.io/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 http://api.fusionnetwork.io/swaps/all?page=0&size=2&sort=asc

#Transactions

 http://api.fusionnetwork.io/transactions/latest
 http://api.fusionnetwork.io/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa
 http://api.fusionnetwork.io/transactions/all?sort=asc&page=2&size=10&field=height
  fields can be:  [ timestamp, hash , type, block , asset ]

  Return an array of transactions from a - seperated array
  http://api.fusionnetwork.io/transactions/ts?ts=address1-address2

#Fusion Price

last price
http://api.fusionnetwork.io/fsnprice

historical prices
http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=asc

last two prices
http://api.fusionnetwork.io/fsnprice/?page=0&size=2&sort=desc

# Search
http://api.fusionnetwork.io/search/[block,blockhash,transaction,address]

#miner leaderboard
http://api.fusionnetwork.io/leaderboard

#Ticket purchase applicaton
  - [autoPurchaseTicket.js ](./autoPurchaseTicket.js)

Example: node autoPurchaseTicket --c"wss://example.com" -p "./password.txt" -k "./keystore.key" -n 10

              -c --connectString web socket gateway to connect to
              -k  --keyStore keystore file to use
              -p  --passPharseFile key file
              -n  --Number of tickets to purchase

