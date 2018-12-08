
# web3-fusion-extend.js - Fusion JavaScript API
# blockexplorerapi 

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

## Installation

```bash
npm install
```

## API Commands

#Assets
  http://localhost:3000/assets/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
  http://localhost:3000/assets/all?page=0&size=2&sort=desc

#Balance
  http://localhost:3000/balances/0x91db50f5c36ae7616009d4e94462dca4d4c7e833
  http://localhost:3000/balances/all?page=0&size=2&sort=asc

#Blocks
  http://localhost:3000/blocks/latest
  http://localhost:3000/blocks/300

  http://localhost:3000/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc

  fields can be:  [ timestamp, hash , numberOfTransactions, height ]

#Swaps
 http://localhost:3000/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 http://localhost:3000/swaps/all?page=0&size=2&sort=asc

#Transactions
 http://localhost:3000/transactions/latest
 http://localhost:3000/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa
 http://localhost:3000/transactions/all?sort=asc&page=2&size=10&field=height
  fields can be:  [ timestamp, hash , type, block , asset ]