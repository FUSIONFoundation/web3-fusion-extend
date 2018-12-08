
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

Fusion organization keeps an api endpoint open at https://explorefusion.io to assist in application development

You can try commands like https://explorefusion.io/blocks/latest  or https://explorefusion.io/transactions/latest

Note if you are not a developer the results may look scary but they are the actual last block or transaction info

## Installation

```bash
npm install
```

## API Commands

If running locally replace explorefusion.io with your own server link

#Assets

  http://explorefusion.io/assets/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
  http://explorefusion.io/assets/all?page=0&size=2&sort=desc

#Balance

  http://explorefusion.io/balances/0x91db50f5c36ae7616009d4e94462dca4d4c7e833
  http://explorefusion.io/balances/all?page=0&size=2&sort=asc

#Blocks

  http://explorefusion.io/blocks/latest
  http://explorefusion.io/blocks/300

  http://explorefusion.io/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc

  fields can be:  [ timestamp, hash , numberOfTransactions, height ]

#Swaps

 http://explorefusion.io/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 http://explorefusion.io/swaps/all?page=0&size=2&sort=asc

#Transactions

 http://explorefusion.io/transactions/latest
 http://explorefusion.io/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa
 http://explorefusion.io/transactions/all?sort=asc&page=2&size=10&field=height
  fields can be:  [ timestamp, hash , type, block , asset ]