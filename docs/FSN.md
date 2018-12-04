FSN documentation

 - [Overview](./README.md)
 - [fsn](./FSN.md)
 - [fsntx](./FSNTX.md)
 - [Constants](./FSNCONSTANTS.md)


```
fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x100",end:"0x200",value:"0x100"},"123456")
```

```
fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x4A5a7Aa4130e407d3708dE56db9000F059200C62",start:"0x100",end:"0x200",value:"0x100"},"123456")
```

common params  _CP_
    from        send from or call member
    gas         gas limit
    gasPrice    gas price
    nonce       send from or call member account nonce

common send params _CSP_ 
    _CP_
    asset     the asset ID
	to          receiver
	value       amount


allAssets           get the all assets list
    no params

```
fsn.allAssets()
```

allNotation         get the all notation 
    no params

```
fsn.allNotation()
```

allSwaps            get the all  quantum swap list
    no params

```
fsn.allSwaps()
```

allTickets          get the all notation
    no params

```
fsn.allTickets()
```

allTicketsByAddress get all tickets by address
       address         the user's address   
```
fsn.allTicketsByAddress(eth.coinbase)
```

totalNumberOfTickets  return number of active tickets
       no params

```
fsn.totalNumberOfTickets()
```

totalNumberOfTicketsByAddress return number of tickets an address controls
       address address that bought tickets

```
fsn.totalNumberOfTicketsByAddress(eth.coinbase)
```


assetToTimeLock     send the asset to time lock 
    _CSP_           see the top
    startTime       the start time of the time lock
    endTime         the end time of the time lock
    password        the account password

```
fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x1",end:"0x2A300",value:"0x1400000000000000"},"123456")

fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x2a900",end:"0x3A300",value:"0x1400000000000000"},"123456")

fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start: getHexDate('2018-12-01') ,end: getHexDate('2019-01-01'),value:"0x1340000000000000"},"123456")
```

getHexDate  helper function to convert date to posix time in hex

```
fsn.getHexDate('2018-12-01')
fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x1",end:"0x100000",value:"0x100"},"123456")
```

timeLockToAsset     send the time lock to asset
    _CSP_           see the top
    startTime       the start time of the time lock
    endTime         the end time of the time lock
    password        the account password

```
fsn.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")
```

timeLockToTimeLock  send the time lock 
    _CSP_           see the top
    startTime       the start time of the time lock
    endTime         the end time of the time lock
    password        the account password

```
fsn.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")
```


buyTicket           buy the ticket
    _CP_            see the top and the "from" ignore
    from            who buy the ticket
    password        the account password

```
fsn.buyTicket({from:fsn.coinbase},"123456")
```

genAsset            generate a asset
    _CP_            see the top and the "from" ignore
    from            who gen the asset and the owner of the asset
    name            the name of asset
    symbol          the symbol of asset
    decimals        the asset decimal digit
    total           the total number of the asset and the owner will be get same number asset
    CanChange       whether asset can be incremented or decremented by the owner [optional]
    password        the account password

```
fsn.genAsset({from:fsn.coinbase,name:"FusionTest",symbol:"FST",decimals:1,total:"0x200"},"123456")
fsn.genAsset({from:"0x91db50f5c36ae7616009d4e94462dca4d4c7e833",name:"JONESY",symbol:"JSY",decimals:1,total:"0x2000000000"},"123123123")
```

genNotation         gen a notation for a account
    _CP_            see the top and the "from" ignore
    from            who gen the notation
    password        the account password

```
fsn.genNotation({from:fsn.coinbase},"123456")
``````

sendAsset           send asset to other account
    _CSP_           see the top

```
fsn.sendAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")

fsn.sendAsset({from:fsn.coinbase,to:"0x91db50F5c36aE7616009d4e94462DcA4D4c7e833",value:"0x2",asset:"0x88d18f81620e5684e880dddcf0b6c167a9154d4c499bc9fad47b98634110eeec"},"123456")
```

decAsset            decrease account asset balance
    _CSP_           see the top and the "from","to" ignore
    from            the asset owner
    to              the dec account
    password        the account password

```    
fsn.decAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
```

incAsset            increase account asset balance
    _CSP_           see the top and the "from","to" ignore
    from            the asset owner
    to              the inc account
    password        the account password


```
fsn.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
```


getAddressByNotation        get the notation of the address
    notation         account notation

```
fsn.getAddressByNotation(104)
```

getAllBalances      get all assets balances
    address         the user's address
    blockNumber     default now block number 

```
fsn.getAllBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
```

getAllTimeLockBalances  get all time lock  balances
    address         the user's address
    blockNumber     default now block number 

```
fsn.getAllTimeLockBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
```

getAsset            get  the asset info
    assetID         the asset ID         

```
fsn.getAsset("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
```

getBalance          like name
    assetID         the asset ID
    address         the user's address
    blockNumber     default now block number 

```
fsn.getBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
```

getNotation         get the notation of address
    address         the account address

```
fsn.getNotation("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
```

getTimeLockBalance  like name
    assetID         the asset ID
    address         the user's address
    blockNumber     default now block number 

```
fsn.getTimeLockBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56ed7b5c")
```

makeSwap            create a quantum swap
    _CP_            see the top
    FromAssetID     sell asset id
	MinFromAmount   the min amount of the sell asset
	ToAssetID       buy asset id
	MinToAmount     the min amount of the buy asset
	SwapSize        the max sell package size
	Targes          the address list of the "who can buy"  can be null
    password        the owner password

```
fsn.makeSwap({from:fsn.coinbase,FromAssetID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ToAssetID:"0xffffffffffffffffffffffffffffffffffffffffffff00000000000000000000",MinToAmount:1,MinFromAmount:2,SwapSize:2,Targes:[]},"123456")
```

recallSwap          destroy a quantum swap  and get the asset back  
    _CP_            see the top
    SwapID          the swap ID
    password        the owner password

```
fsn.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")
```

takeSwap            buy a quantum swap
    _CP_            see the top
    SwapID          the swap ID
    Size            the package size 
    password        the owner password

```
fsn.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")
```


```
  web3.fsn.getHexDate = function( d ) {
        return "0x" + (( new Date(d)).getTime() / 1000).toString(16)
    };

    web3.fsn.hex2a = function( hexData ) {
        hexData = hexData.replace( "0x", "" )
        let hex = hexData.toString();//force conversion
        let str = '';
        for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
```

