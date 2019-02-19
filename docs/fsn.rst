.. _fsn-fsn:

.. include:: include_announcement.rst

===
fsn
===

.. index:: fsn

FSN documentation

- :ref:`Overview <fsn-index>`
- :ref:`fsn <fsn-fsn>`
- :ref:`fsntx <fsn-fsntx>`
- :ref:`Constants <fsn-constants>`

.. code-block:: javascript

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x100",end:"0x200",value:"0x100"},"123456")

.. code-block:: javascript

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x4A5a7Aa4130e407d3708dE56db9000F059200C62",start:"0x100",end:"0x200",value:"0x100"},"123456")

common params CP from send from or call member gas gas limit gasPrice gas price nonce send from or call member account nonce

common send params CSP CP asset the asset ID to receiver value amount




allAssets
=========

.. code-block:: javascript

    fsn.allAssets()
    ...

allAssets get the all assets list no params

----------
Parameters
----------

none

-------
Returns
-------

``Asset Object``: With the following methods:

- ``ID        Hash``: Description
- ``Owner     Address``: Description
- ``Name      string``: Description
- ``Symbol    string``: Description
- ``Decimals  uint8``: Description
- ``Total     *big.Int `json:",string"```: Description
- ``CanChange bool``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.allAssets()

.. code-block:: javascript

    await web3.fsn.allAssets().then(function (res) {
        assetList = res;
    });

    for (let asset in assetList) {
        let id = assetList[asset]["ID"];
        let owner = assetList[asset]["Owner"];
        let owned = false;
        let assetBalance = '';

        try {
            await web3.fsn.getBalance(id, walletAddress).then(function (res) {
                assetBalance = res;
            });
        } catch (err) {
            console.log(err);
        }

allNotation
===========

.. code-block:: javascript

    fsn.allNotation()
    ...

allNotation get the all notation no params

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.allNotation()


allSwaps
========

.. code-block:: javascript

    fsn.allSwaps()
    ...

allSwaps get the all quantum swap list no params

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

        try {
            await web3.fsn.allSwaps().then(function (res) {
                swapList = res;
            });
        } catch (err) {
            console.log(err);
        }

        for (let asset in swapList) {
            let id = swapList[asset]["ID"];
            let owner = swapList[asset]["Owner"];
            let owned = false;
            let assetBalance = '';

            try {
                await web3.fsn.getBalance(id, walletAddress).then(function (res) {
                    assetBalance = res;
                });
            } catch (err) {
                console.log(err);
            }

            let fromAsset = [];
            let toAsset = [];

            try {
                await web3.fsn.getAsset(swapList[asset]["FromAssetID"]).then(function (res) {
                    fromAsset = res;
                });
            } catch (err) {

            }

            try {
                await web3.fsn.getAsset(swapList[asset]["ToAssetID"]).then(function (res) {
                    toAsset = res;
                });
            } catch (err) {

            }

            owner === walletAddress ? owned = true : owned = false;

            let fromAmount = (swapList[asset].MinFromAmount / $scope.countDecimals(fromAsset.Decimals));

            let toAmount = swapList[asset].MinToAmount / $scope.countDecimals(toAsset.Decimals);
            let swapRate = fromAmount / toAmount;
            let time = new Date(parseInt(swapList[asset]["Time"]) * 1000);

            let tMonth = time.getUTCMonth();
            let tDay = time.getUTCDate();
            let tYear = time.getUTCFullYear();

            let hours = time.getUTCHours();
            let minutes = time.getUTCMinutes();

            if (time.getUTCMinutes() < 10) {
                minutes = "0" + time.getUTCMinutes();
            }
            // Global

            time = $scope.months[tMonth] + ' ' + tDay + ', ' + tYear;
            let timeHours = hours + ':' + minutes;

            // Maker parts
            let minimumswap = fromAmount / parseInt(swapList[asset]["SwapSize"]);

            // Taker specific parts
            let swapratetaker = toAmount / fromAmount;
            let minimumswaptaker = fromAmount * swapratetaker;

            // Targes section

            let targes = '';

            swapList[asset]["Targes"].length > 0 ? targes = 'Private' : targes = 'Public';


allTickets
==========

.. code-block:: javascript

    fsn.allTickets()
    ...

allTickets get the all notation no params

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.allTickets()


allTicketsByAddress
===================

.. code-block:: javascript

    fsn.allTicketsByAddress(eth.coinbase)
    ...

allTicketsByAddress get all tickets by address address the user's address

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.allTicketsByAddress(eth.coinbase)

.. code-block:: javascript

    this._web3.fsn.allTicketsByAddress(walletAddress)
        .then(res => {
            return {
            allBalances,
            allTickets: res,
            timelockUsableBalance
            };
        });

totalNumberOfTickets
====================

.. code-block:: javascript

    fsn.totalNumberOfTickets()
    ...

totalNumberOfTickets return number of active tickets no params

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.totalNumberOfTickets()
    
.. code-block:: javascript

    this._web3.fsn
        .totalNumberOfTickets()
        .then(totalTickets => {
            return Object.assign(loadsOfInfo, {
            totalTickets,
            latestBlock: block
            });
        });


totalNumberOfTicketsByAddress
=============================

.. code-block:: javascript

    fsn.totalNumberOfTicketsByAddress(eth.coinbase)
    ...

totalNumberOfTicketsByAddress return number of tickets an address controls address address that bought tickets

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.totalNumberOfTicketsByAddress(eth.coinbase)


assetToTimeLock
===============

.. code-block:: javascript

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x1",end:"0x2A300",value:"0x1400000000000000"},"123456")
    ...

assetToTimeLock send the asset to time lock CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x1",end:"0x2A300",value:"0x1400000000000000"},"123456")

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x2a900",end:"0x3A300",value:"0x1400000000000000"},"123456")

    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start: getHexDate('2018-12-01') ,end: getHexDate('2019-01-01'),value:"0x1340000000000000"},"123456")


getHexDate
==========

.. code-block:: javascript

    fsn.getHexDate('2018-12-01')
    ...

getHexDate helper function to convert date to posix time in hex

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getHexDate('2018-12-01')
    fsn.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x1",end:"0x100000",value:"0x100"},"123456")


timeLockToAsset
===============

.. code-block:: javascript

    fsn.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")
    ...

timeLockToAsset send the time lock to asset CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")


timeLockToTimeLock
==================

.. code-block:: javascript

    fsn.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")
    ...

timeLockToTimeLock send the time lock CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")


buyTicket
=========

.. code-block:: javascript

    fsn.buyTicket({from:fsn.coinbase},"123456")
    ...

buyTicket buy the ticket CP see the top and the "from" ignore from who buy the ticket password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.buyTicket({from:fsn.coinbase},"123456")


genAsset
========

.. code-block:: javascript

    fsn.genAsset({from:fsn.coinbase,name:"FusionTest",symbol:"FST",decimals:1,total:"0x200"},"123456")
    fsn.genAsset({from:"0x91db50f5c36ae7616009d4e94462dca4d4c7e833",name:"JONESY",symbol:"JSY",decimals:1,total:"0x2000000000"},"123123123")
    ...

genAsset generate a asset CP see the top and the "from" ignore from who gen the asset and the owner of the asset name the name of asset symbol the symbol of asset decimals the asset decimal digit total the total number of the asset and the owner will be get same number asset CanChange whether asset can be incremented or decremented by the owner [optional] password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.genAsset({from:fsn.coinbase,name:"FusionTest",symbol:"FST",decimals:1,total:"0x200"},"123456")
    fsn.genAsset({from:"0x91db50f5c36ae7616009d4e94462dca4d4c7e833",name:"JONESY",symbol:"JSY",decimals:1,total:"0x2000000000"},"123123123")

.. code-block:: javascript

      web3.fsn
        .genAsset(
          {
            from: process.env.WALLET_ADDRESS,
            name: assetName,
            symbol: assetShortName,
            decimals: 18,
            total: "0x0",
            CanChange: true
          },
          process.env.PASSPHRASE
        )
        .then(transactionReceipt => {
          return waitForTransactionToComplete(transactionReceipt)
            .then(transactionReceipt => {
              if (transactionReceipt.status != "0x1") {
                done(new Error("transaction error"));
                return;
              }
              let data = JSON.parse(
                web3.fsn.hex2a(transactionReceipt.logs[0].data)
              );
              // console.log("json data => ", data);
              assetId = data.AssetID;
              assert(assetId, "there should be an asset id");
              done();
            })
            .catch(err => {
              console.log(
                "gen asset (waitForTransactionToComplete) created the following error",
                err
              );
              done(err);
            });
        })
        .catch(err => {
          console.log("gen asset created the following error", err);
          done(err);
        });


genNotation
===========

.. code-block:: javascript

    fsn.genNotation({from:fsn.coinbase},"123456")
    ...

genNotation gen a notation for a account CP see the top and the "from" ignore from who gen the notation password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.genNotation({from:fsn.coinbase},"123456")


sendAsset
=========

.. code-block:: javascript

    fsn.sendAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")

    fsn.sendAsset({from:fsn.coinbase,to:"0x91db50F5c36aE7616009d4e94462DcA4D4c7e833",value:"0x2",asset:"0x88d18f81620e5684e880dddcf0b6c167a9154d4c499bc9fad47b98634110eeec"},"123456")
    ...

sendAsset send asset to other account CSP see the top

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.sendAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")

    fsn.sendAsset({from:fsn.coinbase,to:"0x91db50F5c36aE7616009d4e94462DcA4D4c7e833",value:"0x2",asset:"0x88d18f81620e5684e880dddcf0b6c167a9154d4c499bc9fad47b98634110eeec"},"123456")


decAsset
========

.. code-block:: javascript

    fsn.decAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
    ...

decAsset decrease account asset balance CSP see the top and the "from","to" ignore from the asset owner to the dec account password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.decAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")


incAsset
========

.. code-block:: javascript

    fsn.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
    ...

incAsset increase account asset balance CSP see the top and the "from","to" ignore from the asset owner to the inc account password the account password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")


.. code-block:: javascript

      web3.fsn
        .incAsset(
          {
            from: process.env.WALLET_ADDRESS,
            to: process.env.WALLET_ADDRESS,
            value: "1000000000000000000",
            asset: assetId
          },
          process.env.PASSPHRASE
        )
        .then(transactionReceipt => {
          return waitForTransactionToComplete(transactionReceipt)
            .then(transactionReceipt => {
              if (transactionReceipt.status !== true) {
                done(new Error("transaction error " + transactionReceipt));
                return;
              }
              let data = JSON.parse(
                web3.fsn.hex2a(transactionReceipt.logs[0].data)
              );
              // console.log("json data => ", data);
              done();
            })
            .catch(err => {
              console.log(
                "inc asset (waitForTransactionToComplete) created the following error",
                err
              );
              done(err);
            });
        })
        .catch(err => {
          console.log("inc asset created the following error", err);
        });

getAddressByNotation
====================

.. code-block:: javascript

    fsn.getAddressByNotation(104)
    ...

getAddressByNotation get the notation of the address notation account notation

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getAddressByNotation(104)

.. code-block:: javascript

    try {
        await web3.fsn.getAddressByNotation(parseInt(address)).then(function (res) {
            console.log(res);
        });
        $scope.$eval(function () {
            $scope.walletAddressError = false;
            $scope.validWalletAddress = true;
            $scope.checkingUSAN = false;
        });
        return;
    } catch (err) {
        $scope.$eval(function () {
            $scope.walletAddressError = true;
            $scope.validWalletAddress = false;
            $scope.checkingUSAN = false;
        });
        return;
    }


getAllBalances
==============

.. code-block:: javascript

    fsn.getAllBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
    ...

getAllBalances get all assets balances address the user's address blockNumber default now block number

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getAllBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")

.. code-block:: javascript

  try {
    let balances = await web3.fsn.getAllBalances(address);
    all = JSON.stringify({
      balances
    });


getAllTimeLockBalances
======================

.. code-block:: javascript

    fsn.getAllTimeLockBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
    ...

getAllTimeLockBalances get all time lock balances address the user's address blockNumber default now block number

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getAllTimeLockBalances("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")

.. code-block:: javascript

  try {
    let timeLockBalances = await web3.fsn.getAllTimeLockBalances(address);
    all = JSON.stringify({
      timeLockBalances
    });


getAsset
========

.. code-block:: javascript

    fsn.getAsset("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
    ...

getAsset get the asset info assetID the asset ID

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getAsset("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")

.. code-block:: javascript

    try {
        await web3.fsn.getAsset(data["FromAssetID"]).then(function (res) {
            fromAsset = res;
        });
    } catch (err) {
        console.log(err);
    }


getBalance
==========

.. code-block:: javascript

    fsn.getBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
    ...

getBalance like name assetID the asset ID address the user's address blockNumber default now block number

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")

.. code-block:: javascript

    try {
        await web3.fsn.getBalance(id, walletAddress).then(function (res) {
            assetBalance = res;
        });
    } catch (err) {
        console.log(err);
    }

getNotation
===========

.. code-block:: javascript

    fsn.getNotation("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")
    ...

getNotation get the notation of address address the account address

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getNotation("0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c")

.. code-block:: javascript

  try {
    let notation = await web3.fsn.getNotation(address);
    all = JSON.stringify({
      notation
    });


getTimeLockBalance
==================

.. code-block:: javascript

    fsn.getTimeLockBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56ed7b5c")
    ...

getTimeLockBalance like name assetID the asset ID address the user's address blockNumber default now block number

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.getTimeLockBalance("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff","0x9c48c796cb0bed51a14291bc8cc56ed7b5c")


makeSwap
========

.. code-block:: javascript

    fsn.makeSwap({from:fsn.coinbase,FromAssetID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ToAssetID:"0xffffffffffffffffffffffffffffffffffffffffffff00000000000000000000",MinToAmount:1,MinFromAmount:2,SwapSize:2,Targes:[]},"123456")
    ...

makeSwap create a quantum swap CP see the top FromAssetID sell asset id MinFromAmount the min amount of the sell asset ToAssetID buy asset id MinToAmount the min amount of the buy asset SwapSize the max sell package size Targes the address list of the "who can buy" can be null password the owner password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.makeSwap({from:fsn.coinbase,FromAssetID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ToAssetID:"0xffffffffffffffffffffffffffffffffffffffffffff00000000000000000000",MinToAmount:1,MinFromAmount:2,SwapSize:2,Targes:[]},"123456")


recallSwap
==========

.. code-block:: javascript

    fsn.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")
    ...

recallSwap destroy a quantum swap and get the asset back
CP see the top SwapID the swap ID password the owner password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")


takeSwap
========

.. code-block:: javascript

    fsn.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")
    ...

takeSwap buy a quantum swap CP see the top SwapID the swap ID Size the package size password the owner password

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsn.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")

.. code-block:: javascript

    fsn.getSnapshot( blocknumber )
    fsn.getSnapshotHash(blockHas)

.. code-block:: javascript

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


