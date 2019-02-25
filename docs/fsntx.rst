.. _fsn-fsntx:

.. include:: include_announcement.rst

=====
fsntx
=====

.. index:: fsntx

FSNTX commands

- :ref:`Overview <fsn-index>`
- :ref:`fsn <fsn-fsn>`
- :ref:`Constants <fsn-constants>`

.. code-block:: javascript

    personal.unlockAccount( eth.coinbase, "123456" ) 
    var tx = fsntx.buildBuyTicketTx( {from:eth.coinbase} ) 
    tx.from = eth.coinbase 
    var tx2 = eth.signTransaction( tx ) 
    fsntx.sendRawTransaction(tx2.tx)


sendRawTransaction
==================

.. code-block:: javascript

    fsntx.sendRawTransaction()
    ...

sendRawTransaction

----------
Parameters
----------

1. ``tx`` - ``*types.Transaction``: Description

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.sendRawTransaction()

.. code-block:: javascript

    $scope.recallSwap = async function (swap_id) {
        if (walletService.wallet !== null) {
            let password = walletService.password;
            let accountData = uiFuncs.getTxData($scope);
            let walletAddress = accountData.from;

            let data = {
                from: walletAddress,
                SwapID: swap_id
            };

            if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildRecallSwapTx(data).then(function (tx) {
                    tx.from = walletAddress;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        console.log(txHash);
                        $scope.recallSwapSuccess.open()
                    })
                })
            } catch (err) {
                $scope.errorModal.open();
                console.log(err);
            }
            if ($scope.wallet.hwType == "ledger") {
                let ledgerConfig = {
                    privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : "",
                    path: $scope.wallet.getPath(),
                    hwType: $scope.wallet.getHWType(),
                    hwTransport: $scope.wallet.getHWTransport()
                }
                let rawTx = data;
                var eTx = new ethUtil.Tx(rawTx);
                if (ledgerConfig.hwType == "ledger") {
                    var app = new ledgerEth(ledgerConfig.hwTransport);
                    var EIP155Supported = true;
                    var localCallback = async function (result, error) {
                        if (typeof error != "undefined") {
                            if (callback !== undefined) callback({
                                isError: true,
                                error: error
                            });
                            return;
                        }
                        var splitVersion = result['version'].split('.');
                        if (parseInt(splitVersion[0]) > 1) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[1]) > 0) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[2]) > 2) {
                            EIP155Supported = true;
                        }
                        var oldTx = Object.assign(rawTx, {});
                        let input = oldTx.input;
                        return uiFuncs.signed(app, rawTx, ledgerConfig, true, function (res) {
                            oldTx.r = res.r;
                            oldTx.s = res.s;
                            oldTx.v = res.v;
                            oldTx.input = input;
                            oldTx.chainId = "0x1";
                            delete oldTx.isError;
                            delete oldTx.rawTx;
                            delete oldTx.signedTx;
                            web3.fsntx.sendRawTransaction(oldTx).then(function (txHash) {
                                $scope.recallSwapSuccess.open()
                            })
                        })
                    }
                    $scope.notifier.info('Please, confirm transaction on Ledger.');
                    await app.getAppConfiguration(localCallback);
                }
            }
        }
    }

buildGenNotationTx
==================

.. code-block:: javascript

    fsntx.buildGenNotationTx()
    ...

buildGenNotationTx

----------
Parameters
----------

1. ``FusionBaseArgs`` - ``Object``: Description

  - ``From`` - ``common.Address`` - ``json:"from"``: Description
  - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
  - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
  - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

.. code-block:: javascript

    FusionBaseArgs {
        From     common.Address  `json:"from"`
        Gas      *hexutil.Uint64 `json:"gas"`
        GasPrice *hexutil.Big    `json:"gasPrice"`
        Nonce    *hexutil.Uint64 `json:"nonce"`
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    await web3.fsntx.buildGenNotationTx({
        from: walletAddress
    }).then((tx) => {
        tx.chainId = _CHAINID;
        data = tx;
        tx.from = walletAddress;
        if ($scope.wallet.hwType == "ledger"){
            return;
        }
        return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
            $scope.requestedSAN = true;
            $scope.$apply(function () {
                $scope.addressNotation.value = 'USAN Requested';
                $scope.addressNotation.value = 'USAN Requested';
            });
        })
    });


genNotation
===========

.. code-block:: javascript

    fsntx.genNotation({from:fsn.coinbase},"123456")
    ...

genNotation gen a notation for a account CP see the top and the "from" ignore from who gen the notation password the account password

----------
Parameters
----------

1. ``FusionBaseArgs`` - ``Object``: Description

  - ``From`` - ``common.Address`` - ``json:"from"``: Description
  - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
  - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
  - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

2. ``passwd`` - ``string``: Description

.. code-block:: javascript

    FusionBaseArgs {
        From     common.Address  `json:"from"`
        Gas      *hexutil.Uint64 `json:"gas"`
        GasPrice *hexutil.Big    `json:"gasPrice"`
        Nonce    *hexutil.Uint64 `json:"nonce"`
    }
    passwd string

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.genNotation({from:fsn.coinbase},"123456")


buildGenAssetTx
===============

.. code-block:: javascript

    fsntx.buildGenAssetTx()
    ...

buildGenAssetTx

----------
Parameters
----------

1. ``GenAssetArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description
  - ``Name`` - ``string`` - ``json:"name"``: Description
  - ``Symbol`` - ``string`` - ``json:"symbol"``: Description
  - ``Decimals`` - ``uint8`` - ``json:"decimals"``: Description
  - ``Total`` - ``*hexutil.Big`` - ``json:"total"``: Description
  - ``CanChange`` - ``bool`` - ``json:"canChange"``: Description


.. code-block:: javascript

    GenAssetArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        Name      string       `json:"name"`
        Symbol    string       `json:"symbol"`
        Decimals  uint8        `json:"decimals"`
        Total     *hexutil.Big `json:"total"`
        CanChange bool         `json:"canChange"`
    }


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
        await web3.fsntx.buildGenAssetTx(data).then(tx => {
            tx.chainId = _CHAINID;
            data = tx;
            if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                return;
            } else {
                return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    $scope.$eval(function () {
                        $scope.assetCreate.errorMessage = '';
                        $scope.assetCreate.assetHash = txHash;
                    });
                    $scope.createAssetFinal.open();
                });
            }
        });
    } catch (err) {
        $scope.errorModal.open();
    }


genAsset
========

.. code-block:: javascript

    fsntx.genAsset({from:fsn.coinbase,name:"FusionTest",symbol:"FST",decimals:1,total:"0x200"},"123456")
    fsntx.genAsset({from:"0x91db50f5c36ae7616009d4e94462dca4d4c7e833",name:"JONESY",symbol:"JSY",decimals:1,total:"0x2000000000"},"123123123")
    ...

genAsset generate a asset CP see the top and the "from" ignore from who gen the asset and the owner of the asset name the name of asset symbol the symbol of asset decimals the asset decimal digit total the total number of the asset and the owner will be get same number asset CanChange whether asset can be incremented or decremented by the owner [optional] password the account password

----------
Parameters
----------

1. ``GenAssetArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description
  - ``Name`` - ``string`` - ``json:"name"``: Description
  - ``Symbol`` - ``string`` - ``json:"symbol"``: Description
  - ``Decimals`` - ``uint8`` - ``json:"decimals"``: Description
  - ``Total`` - ``*hexutil.Big`` - ``json:"total"``: Description
  - ``CanChange`` - ``bool`` - ``json:"canChange"``: Description

2. ``passwd`` - ``string``: Description

.. code-block:: javascript

    GenAssetArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        Name      string       `json:"name"`
        Symbol    string       `json:"symbol"`
        Decimals  uint8        `json:"decimals"`
        Total     *hexutil.Big `json:"total"`
        CanChange bool         `json:"canChange"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.genAsset({from:fsn.coinbase,name:"FusionTest",symbol:"FST",decimals:1,total:"0x200"},"123456")
    fsntx.genAsset({from:"0x91db50f5c36ae7616009d4e94462dca4d4c7e833",name:"JONESY",symbol:"JSY",decimals:1,total:"0x2000000000"},"123123123")



buildSendAssetTx
================

.. code-block:: javascript

    fsntx.buildSendAssetTx()
    ...

buildSendAssetTx

----------
Parameters
----------

1. ``SendAssetArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description


.. code-block:: javascript

    SendAssetArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID common.Hash    `json:"asset"`
        To      common.Address `json:"to"`
        Value   *hexutil.Big   `json:"value"`
    }


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildSendAssetTx()

.. code-block:: javascript

    $scope.sendAsset = async function () {
        $scope.successMessagebool = true;
        let accountData = uiFuncs.getTxData($scope);
        let from = accountData.from;
        let to = $scope.sendAsset.toAddress;
        let decimals = '';
        let asset = $scope.assetToSend;
        let hash = '';
        let data = {};

        if (to.length < 42) {
            await web3.fsn.getAddressByNotation(parseInt(to)).then(function (address) {
                to = address;
            });
        }

        await web3.fsn.getAsset(asset).then(function (res) {
            decimals = parseInt(res["Decimals"]);
        });

        let amount = $scope.sendAsset.amountToSend.toString();

        amount = $scope.makeBigNumber(amount, decimals);

        if ($scope.transactionType == "none") {

            if (!$scope.account && ($scope.wallet.hwType !== "ledger") && ($scope.wallet.hwType !== "trezor")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildSendAssetTx({
                    from: from,
                    to: to,
                    value: amount.toString(),
                    asset: asset
                }).then((tx) => {
                    console.log(tx);
                    tx.from = from;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        hash = txHash;
                        $scope.sendAssetFinal.open();
                        $scope.$eval(function () {
                            $scope.successHash = hash;
                            $scope.successHash = hash;
                        });
                    })
                });
            } catch (err) {
                console.log(err);
                $scope.errorModal.open();
            }


sendAsset
=========

.. code-block:: javascript

    fsntx.sendAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")

    fsntx.sendAsset({from:fsn.coinbase,to:"0x91db50F5c36aE7616009d4e94462DcA4D4c7e833",value:"0x2",asset:"0x88d18f81620e5684e880dddcf0b6c167a9154d4c499bc9fad47b98634110eeec"},"123456")
    ...

sendAsset send asset to other account CSP see the top

----------
Parameters
----------

1. ``SendAssetArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description

2. ``passwd`` - ``string``: Description


.. code-block:: javascript

    SendAssetArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID common.Hash    `json:"asset"`
        To      common.Address `json:"to"`
        Value   *hexutil.Big   `json:"value"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.sendAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")

    fsntx.sendAsset({from:fsn.coinbase,to:"0x91db50F5c36aE7616009d4e94462DcA4D4c7e833",value:"0x2",asset:"0x88d18f81620e5684e880dddcf0b6c167a9154d4c499bc9fad47b98634110eeec"},"123456")


buildAssetToTimeLockTx
======================

.. code-block:: javascript

    fsntx.buildAssetToTimeLockTx()
    ...

buildAssetToTimeLockTx

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description


.. note:: Note text.

.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildAssetToTimeLockTx()

.. code-block:: javascript

    $scope.sendAsset = async function () {
        $scope.successMessagebool = true;
        let accountData = uiFuncs.getTxData($scope);
        let from = accountData.from;
        let to = $scope.sendAsset.toAddress;
        let decimals = '';
        let asset = $scope.assetToSend;
        let hash = '';
        let data = {};

        if (to.length < 42) {
            await web3.fsn.getAddressByNotation(parseInt(to)).then(function (address) {
                to = address;
            });
        }

        await web3.fsn.getAsset(asset).then(function (res) {
            decimals = parseInt(res["Decimals"]);
        });

        let amount = $scope.sendAsset.amountToSend.toString();

        amount = $scope.makeBigNumber(amount, decimals);

        if ($scope.transactionType == "none") {

            if (!$scope.account && ($scope.wallet.hwType !== "ledger") && ($scope.wallet.hwType !== "trezor")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildSendAssetTx({
                    from: from,
                    to: to,
                    value: amount.toString(),
                    asset: asset
                }).then((tx) => {
                    console.log(tx);
                    tx.from = from;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        hash = txHash;
                        $scope.sendAssetFinal.open();
                        $scope.$eval(function () {
                            $scope.successHash = hash;
                            $scope.successHash = hash;
                        });
                    })
                });
            } catch (err) {
                console.log(err);
                $scope.errorModal.open();
            }

            $scope.$apply(function () {
                $scope.successHash = hash;
            });
        }
        if ($scope.transactionType == "daterange") {

            if ($scope.sendAsset.fromTime == '') {
                $scope.sendAsset.fromTime = new Date();
            }

            let fromTime = getHexDate(convertDate($scope.sendAsset.fromTime));
            let tillTime = getHexDate(convertDate($scope.sendAsset.tillTime));
            if (!$scope.account && ($scope.wallet.hwType !== "ledger") && ($scope.wallet.hwType !== "trezor")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildAssetToTimeLockTx({
                    asset: asset,
                    from: from,
                    to: to,
                    start: fromTime,
                    end: tillTime,
                    value: amount
                }).then((tx) => {
                    tx.from = from;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        $scope.sendAssetFinal.open();
                        $scope.$eval(function () {
                            $scope.successHash = txHash;
                            $scope.successHash = txHash;
                        });
                    })
                });
            } catch (err) {
                $scope.errorModal.open();
            }
        }


assetToTimeLock
===============

.. code-block:: javascript

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x1",end:"0x2A300",value:"0x1400000000000000"},"123456")

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x2a900",end:"0x3A300",value:"0x1400000000000000"},"123456")

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start: getHexDate('2018-12-01') ,end: getHexDate('2019-01-01'),value:"0x1340000000000000"},"123456")
    ...

assetToTimeLock send the asset to time lock CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description

2. ``passwd`` - ``string``: Description


.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x1",end:"0x2A300",value:"0x1400000000000000"},"123456")

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start:"0x2a900",end:"0x3A300",value:"0x1400000000000000"},"123456")

    fsntx.assetToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0xa7455DF112c953F3c73c2C25559965e1A8a20024",start: getHexDate('2018-12-01') ,end: getHexDate('2019-01-01'),value:"0x1340000000000000"},"123456")


buildTimeLockToTimeLockTx
=========================

.. code-block:: javascript

    fsntx.buildTimeLockToTimeLockTx()
    ...

buildTimeLockToTimeLockTx

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description


.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildTimeLockToTimeLockTx()

.. code-block:: javascript

        if (!$scope.account && ($scope.wallet.hwType !== "ledger") && ($scope.wallet.hwType !== "trezor")) {
            $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
        }

        try {
            await web3.fsntx.buildTimeLockToTimeLockTx({
                asset: asset,
                from: from,
                to: to,
                start: fromTime,
                end: tillTime,
                value: amount
            }).then((tx) => {
                tx.from = from;
                tx.chainId = _CHAINID;
                data = tx;
                if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                    return;
                }
                return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    $scope.$eval(function () {
                        $scope.sendAssetFinal.open();
                        $scope.successHash = txHash;
                        $scope.successHash = txHash;
                    });
                })
            });
        } catch (err) {
            $scope.errorModal.open();
        }


timeLockToTimeLock
==================

.. code-block:: javascript

    fsntx.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")
    ...

timeLockToTimeLock send the time lock CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description

2. ``passwd`` - ``string``: Description


.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }
    passwd string

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")


buildTimeLockToAssetTx
======================

.. code-block:: javascript

    fsntx.buildTimeLockToAssetTx()
    ...

buildTimeLockToAssetTx

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description

.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildTimeLockToAssetTx()

.. code-block:: javascript

    $scope.sendBackToAssetsFunction = async function (id) {
        let accountData = uiFuncs.getTxData($scope);
        id = $scope.timeLockToAssetId;
        let tlData = $scope.timeLockList[id];

        let from = accountData.from;

        if (!$scope.account && ($scope.wallet.hwType !== "ledger") && ($scope.wallet.hwType !== "trezor")) {
            $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
        }

        let startTime = web3.utils.numberToHex(tlData.posixStartTime);
        let endTime = web3.utils.numberToHex(tlData.posixEndTime);

        // JavaScript / Go incompatibility -1 error
        if (tlData.posixEndTime === 18446744073709552000) {
            endTime = web3.fsn.consts.TimeForeverStr;
        }

        let data = {};

        try {
            await web3.fsntx.buildTimeLockToAssetTx({
                asset: tlData.asset,
                from: from,
                to: from,
                start: startTime,
                end: endTime,
                value: tlData.rawValue
            }).then((tx) => {
                tx.from = from;
                tx.chainId = _CHAINID;
                data = tx;
                if ($scope.wallet.hwType == "ledger" || $scope.wallet.hwType == "trezor") {
                    return;
                }
                return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    $scope.successModal.open();
                })
            });
        } catch (err) {
            $scope.errorModal.open();
        }


timeLockToAsset
===============

.. code-block:: javascript

    fsntx.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")
    ...

timeLockToAsset send the time lock to asset CSP see the top startTime the start time of the time lock endTime the end time of the time lock password the account password

----------
Parameters
----------

1. ``TimeLockArgs`` - ``Object``: Description 

  - ``SendAssetArgs`` - ``Object``: Description

    - ``FusionBaseArgs`` - ``Object``: Description

      - ``From`` - ``common.Address`` - ``json:"from"``: Description
      - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
      - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
      - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

    - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
    - ``To`` - ``common.Address`` - ``json:"to"``: Description
    - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
    
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description

2. ``passwd`` - ``string``: Description


.. code-block:: javascript

    TimeLockArgs {
        SendAssetArgs {
            FusionBaseArgs {
                From     common.Address  `json:"from"`
                Gas      *hexutil.Uint64 `json:"gas"`
                GasPrice *hexutil.Big    `json:"gasPrice"`
                Nonce    *hexutil.Uint64 `json:"nonce"`

            }
            AssetID common.Hash    `json:"asset"`
            To      common.Address `json:"to"`
            Value   *hexutil.Big   `json:"value"`
        }
        StartTime *hexutil.Uint64 `json:"start"`
        EndTime   *hexutil.Uint64 `json:"end"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")


buildBuyTicketTx
================

.. code-block:: javascript

    fsntx.buildBuyTicketTx()
    ...

buildBuyTicketTx

----------
Parameters
----------

1. ``BuyTicketArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description


.. code-block:: javascript

    BuyTicketArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        Start *hexutil.Uint64 `json:"start"`
        End   *hexutil.Uint64 `json:"end"`
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    this._web3.fsntx
      .buildBuyTicketTx({ from: this._walletAddress, end: dayHex })
      .then(tx => {
        console.log(tx);
        // tx.gasLimit =  this._web3.utils.toWei( 21000, "gwei" )
        if (!this._web3 || !this.provider || !this.provider.__connected) {
          // reconnecting need to wait
          cb(new Error("reconnecting"), "reconnecting");
          return;
        }
        return this._web3.fsn.signAndTransmit(
          tx,
          currentDataState.data.signInfo.signTransaction
        );
      })
      .then(txHash => {
        console.log("buy ticket tx -> ", txHash);
        if (!data.activeTicketPurchase) {
          cb(null, "asked to leave");
          return true;
        }
        data.lastStatus = "Pending Tx:" + utils.midHashDisplay(txHash);
        data.lastCall = "purchaseSubmitTicket";
        this.emit("purchaseSubmitTicket", data);
        this.checkConnection();
        return this.waitForTransactionToComplete(
          txHash,
          data,
          new Date().getTime() + 120000
        )
          .then(r => {
            if (r.status) {
              cb(null, "Ticket bought");
            } else {
              cb(new Error("failed to buy"), "Failed to buy ticket will retry");
            }
          })
          .catch(err => {
            cb(err, "Error waiting for ticket to complete");
          });
      })
      .catch(err => {
        console.log(err)
        cb(err, "unknown err");
      });

buyTicket
=========

.. code-block:: javascript

    fsntx.buyTicket({from:fsn.coinbase},"123456")
    ...

buyTicket buy the ticket CP see the top and the "from" ignore from who buy the ticket password the account password

----------
Parameters
----------

1. ``BuyTicketArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description
  - ``StartTime`` - ``*hexutil.Uint64`` - ``json:"start"``: Description
  - ``EndTime`` - ``*hexutil.Uint64`` - ``json:"end"``: Description

2. ``passwd`` - ``string``: Description


.. code-block:: javascript

    BuyTicketArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        Start *hexutil.Uint64 `json:"start"`
        End   *hexutil.Uint64 `json:"end"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buyTicket({from:fsn.coinbase},"123456")


buildIncAssetTx
===============

.. code-block:: javascript

    fsntx.buildIncAssetTx()
    ...

buildIncAssetTx

----------
Parameters
----------

1. ``AssetValueChangeExArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
  - ``IsInc`` - ``bool`` - ``json:"isInc"``: Description
  - ``TransacData`` - ``string``-  ``json:"transacData"``: Description

.. code-block:: javascript

    AssetValueChangeExArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID     common.Hash    `json:"asset"`
        To          common.Address `json:"to"`
        Value       *hexutil.Big   `json:"value"`
        IsInc       bool           `json:"isInc"`
        TransacData string         `json:"transacData"`
    }


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildIncAssetTx()

.. code-block:: javascript

  return web3.fsntx
    .buildIncAssetTx({
      from: key.address,
      to: key.address,
      value: "1000000000000000000",
      asset: assetId
    })
    .then(tx => {
      tx.gasPrice = web3.utils.toWei( new web3.utils.BN( "3" ), "gwei");
      return web3.fsn.signAndTransmit(tx, signInfo.signTransaction).then(tx => {
        totalSent += 1
        console.log( totalSent + "   " +  index * subToDo , tx);
        transactionList.push(tx);
        incAsset(index + 1, numberToDo, done) 
      });
    })
    .catch(err => {
      console.log("inc asset created the following error", err);
      done(err);
    });


incAsset
========

.. code-block:: javascript

    fsntx.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
    ...

incAsset increase account asset balance CSP see the top and the "from","to" ignore from the asset owner to the inc account password the account password

----------
Parameters
----------


1. ``AssetValueChangeExArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
  - ``IsInc`` - ``bool`` - ``json:"isInc"``: Description
  - ``TransacData`` - ``string``-  ``json:"transacData"``: Description

2. ``passwd`` - ``string``: Description

.. code-block:: javascript

    AssetValueChangeExArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID     common.Hash    `json:"asset"`
        To          common.Address `json:"to"`
        Value       *hexutil.Big   `json:"value"`
        IsInc       bool           `json:"isInc"`
        TransacData string         `json:"transacData"`
    }
    passwd string

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")


buildDecAssetTx
===============

.. code-block:: javascript

    fsntx.buildDecAssetTx()
    ...

buildDecAssetTx

----------
Parameters
----------

1. ``AssetValueChangeExArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
  - ``IsInc`` - ``bool`` - ``json:"isInc"``: Description
  - ``TransacData`` - ``string``-  ``json:"transacData"``: Description

.. code-block:: javascript

    AssetValueChangeExArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID     common.Hash    `json:"asset"`
        To          common.Address `json:"to"`
        Value       *hexutil.Big   `json:"value"`
        IsInc       bool           `json:"isInc"`
        TransacData string         `json:"transacData"`
    }


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildDecAssetTx()


decAsset
========

.. code-block:: javascript

    fsntx.decAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
    ...

decAsset decrease account asset balance CSP see the top and the "from","to" ignore from the asset owner to the dec account password the account password

----------
Parameters
----------

1. ``AssetValueChangeExArgs`` - ``Object``: Description

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``AssetID`` - ``common.Hash`` - ``json:"asset"``: Description
  - ``To`` - ``common.Address`` - ``json:"to"``: Description
  - ``Value`` - ``*hexutil.Big`` - ``json:"value"``: Description
  - ``IsInc`` - ``bool`` - ``json:"isInc"``: Description
  - ``TransacData`` - ``string``-  ``json:"transacData"``: Description

2. ``passwd`` - ``string``: Description

.. code-block:: javascript

    AssetValueChangeExArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`

        }
        AssetID     common.Hash    `json:"asset"`
        To          common.Address `json:"to"`
        Value       *hexutil.Big   `json:"value"`
        IsInc       bool           `json:"isInc"`
        TransacData string         `json:"transacData"`
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.decAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")


buildMakeSwapTx
===============

.. code-block:: javascript

    fsntx.buildMakeSwapTx()
    ...

buildMakeSwapTx

----------
Parameters
----------

1. ``MakeSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``FromAssetID`` - ``common.Hash``: Description
  - ``FromStartTime`` - ``*hexutil.Uint64``: Description
  - ``FromEndTime`` - ``*hexutil.Uint64``: Description
  - ``MinFromAmount`` - ``*hexutil.Big``: Description
  - ``ToAssetID`` - ``common.Hash``: Description
  - ``ToStartTime`` - ``*hexutil.Uint64``: Description
  - ``ToEndTime`` - ``*hexutil.Uint64``: Description
  - ``MinToAmount`` - ``*hexutil.Big``: Description
  - ``SwapSize`` - ``*big.Int``: Description
  - ``Targes`` - ``[]common.Address``: Description
  - ``Time`` - ``*big.Int``: Description

.. note:: Note text.

.. code-block:: javascript

    MakeSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
        FromAssetID   common.Hash
        FromStartTime *hexutil.Uint64
        FromEndTime   *hexutil.Uint64
        MinFromAmount *hexutil.Big
        ToAssetID     common.Hash
        ToStartTime   *hexutil.Uint64
        ToEndTime     *hexutil.Uint64
        MinToAmount   *hexutil.Big
        SwapSize      *big.Int
        Targes        []common.Address
        Time          *big.Int
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildMakeSwapTx()

.. code-block:: javascript

    $scope.makeSwap = async function () {
        targesArray = [];
        let password = walletService.password;
        let accountData = uiFuncs.getTxData($scope);
        let walletAddress = accountData.from;

        let fromAsset = [];
        let toAsset = [];


        try {
            await web3.fsn.getAsset($scope.assetToSend).then(function (res) {
                fromAsset = res;
            });
        } catch (err) {
            $scope.errorModal.open();
            console.log(err);
        }


        try {
            await web3.fsn.getAsset($scope.assetToReceive).then(function (res) {
                toAsset = res;
            });
        } catch (err) {
            $scope.errorModal.open();
            console.log(err);
        }

        if ($scope.makeTarges !== '') {
            let targesArr = $scope.makeTarges.split(',');
            await $scope.processAllTarges(targesArr, 0);

            console.log(targesArray);
        } else {
            targesArray = [];
        }

        if ($scope.makeMinumumSwap == "" || $scope.makeMinumumSwap <= 0) {
            $scope.makeMinumumSwap = 1;
        }

        //Global
        let makeMinimumSwapBN = new BigNumber($scope.makeMinumumSwap);

        //Receive Part
        BigNumber.config({ DECIMAL_PLACES: parseInt(toAsset["Decimals"]-1) });
        let makeReceiveAmountBN = new BigNumber($scope.makeReceiveAmount);
        let makeReceiveAmountDiv = makeReceiveAmountBN.div(makeMinimumSwapBN);
        let makeReceiveString = makeReceiveAmountDiv.toString();
        let makeReceiveFinal = $scope.makeBigNumber(makeReceiveString , parseInt(toAsset["Decimals"]));

        //Send Part
        BigNumber.config({ DECIMAL_PLACES: parseInt(fromAsset["Decimals"]-1) });
        let makeSendAmountBN = new BigNumber($scope.makeSendAmount);
        let makeSendAmountDiv = makeSendAmountBN.div(makeMinimumSwapBN);
        let makeSendString = makeSendAmountDiv.toString();
        let makeSendFinal = $scope.makeBigNumber(makeSendString , parseInt(fromAsset["Decimals"]));

        //Convert to Hex

        let minToAmountHex = "0x" + makeReceiveFinal.toString(16);
        let minFromAmountHex = "0x" + makeSendFinal.toString(16);


        let data = {
            from: walletAddress,
            FromAssetID: $scope.assetToSend,
            ToAssetID: $scope.assetToReceive,
            MinToAmount: minToAmountHex,
            MinFromAmount: minFromAmountHex,
            SwapSize: parseInt($scope.makeMinumumSwap),
            Targes: targesArray
        };

        // Send part
        if ($scope.showTimeLockSend == true) {
            if ($scope.sendTimeLock == 'scheduled') {
                let fromStartTime = getHexDate(convertDate($scope.fromStartTime));
                let fromEndTime = web3.fsn.consts.TimeForeverStr;

                data.FromStartTime = fromStartTime;
                data.FromEndTime = fromEndTime;
            }
            if ($scope.sendTimeLock == 'daterange') {
                let fromStartTime = getHexDate(convertDate($scope.todayDate));
                let fromEndTime = getHexDate(convertDate($scope.fromEndTime));

                data.FromStartTime = fromStartTime;
                data.FromEndTime = fromEndTime;
            }
        }

        // Receive part
        if ($scope.showTimeLockReceive == true) {
            if ($scope.receiveTimeLock == 'scheduled') {
                let toStartTime = getHexDate(convertDate($scope.ToStartTime));
                let toEndTime = web3.fsn.consts.TimeForeverStr;

                data.ToStartTime = toStartTime;
                data.ToEndTime = toEndTime;
            }

            if ($scope.receiveTimeLock == 'daterange') {
                let toStartTime = getHexDate(convertDate($scope.todayDate));
                let toEndTime = getHexDate(convertDate($scope.ToEndTime));

                data.ToStartTime = toStartTime;
                data.ToEndTime = toEndTime;
            }
        }

        if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
            $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
        }

        console.log(data);

        try {
            await web3.fsntx.buildMakeSwapTx(data).then(function (tx) {
                console.log(tx);
                tx.from = walletAddress;
                tx.chainId = _CHAINID;
                data = tx;
                if ($scope.wallet.hwType == "ledger") {
                    return;
                }
                return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    console.log(txHash);
                    $scope.makeSwapConfirmation('end');
                })
            })
        } catch (err) {
            $scope.errorModal.open();
            console.log(err);
        }
 



makeSwap
========

.. code-block:: javascript

    fsntx.makeSwap({from:fsn.coinbase,FromAssetID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ToAssetID:"0xffffffffffffffffffffffffffffffffffffffffffff00000000000000000000",MinToAmount:1,MinFromAmount:2,SwapSize:2,Targes:[]},"123456")
    ...

makeSwap create a quantum swap CP see the top FromAssetID sell asset id MinFromAmount the min amount of the sell asset ToAssetID buy asset id MinToAmount the min amount of the buy asset SwapSize the max sell package size Targes the address list of the "who can buy" can be null password the owner password

----------
Parameters
----------

1. ``MakeSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``FromAssetID`` - ``common.Hash``: Description
  - ``FromStartTime`` - ``*hexutil.Uint64``: Description
  - ``FromEndTime`` - ``*hexutil.Uint64``: Description
  - ``MinFromAmount`` - ``*hexutil.Big``: Description
  - ``ToAssetID`` - ``common.Hash``: Description
  - ``ToStartTime`` - ``*hexutil.Uint64``: Description
  - ``ToEndTime`` - ``*hexutil.Uint64``: Description
  - ``MinToAmount`` - ``*hexutil.Big``: Description
  - ``SwapSize`` - ``*big.Int``: Description
  - ``Targes`` - ``[]common.Address``: Description
  - ``Time`` - ``*big.Int``: Description

2. ``passwd`` - ``string``: Description


.. note:: Note text.

.. code-block:: javascript

    MakeSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
        FromAssetID   common.Hash
        FromStartTime *hexutil.Uint64
        FromEndTime   *hexutil.Uint64
        MinFromAmount *hexutil.Big
        ToAssetID     common.Hash
        ToStartTime   *hexutil.Uint64
        ToEndTime     *hexutil.Uint64
        MinToAmount   *hexutil.Big
        SwapSize      *big.Int
        Targes        []common.Address
        Time          *big.Int
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.makeSwap({from:fsn.coinbase,FromAssetID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
                ToAssetID:"0xffffffffffffffffffffffffffffffffffffffffffff00000000000000000000",MinToAmount:1,MinFromAmount:2,SwapSize:2,Targes:[]},"123456")


buildRecallSwapTx
=================

.. code-block:: javascript

    fsntx.buildRecallSwapTx()
    ...

buildRecallSwapTx

----------
Parameters
----------

1. ``RecallSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``SwapID`` - ``common.Hash``: Description

.. note:: Note text.

.. code-block:: javascript

    RecallSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
    	SwapID common.Hash
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.buildRecallSwapTx()

.. code-block:: javascript

    $scope.recallSwap = async function (swap_id) {
        if (walletService.wallet !== null) {
            let password = walletService.password;
            let accountData = uiFuncs.getTxData($scope);
            let walletAddress = accountData.from;

            let data = {
                from: walletAddress,
                SwapID: swap_id
            };

            if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildRecallSwapTx(data).then(function (tx) {
                    tx.from = walletAddress;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        console.log(txHash);
                        $scope.recallSwapSuccess.open()
                    })
                })
            } catch (err) {
                $scope.errorModal.open();
                console.log(err);
            }
            if ($scope.wallet.hwType == "ledger") {
                let ledgerConfig = {
                    privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : "",
                    path: $scope.wallet.getPath(),
                    hwType: $scope.wallet.getHWType(),
                    hwTransport: $scope.wallet.getHWTransport()
                }
                let rawTx = data;
                var eTx = new ethUtil.Tx(rawTx);
                if (ledgerConfig.hwType == "ledger") {
                    var app = new ledgerEth(ledgerConfig.hwTransport);
                    var EIP155Supported = true;
                    var localCallback = async function (result, error) {
                        if (typeof error != "undefined") {
                            if (callback !== undefined) callback({
                                isError: true,
                                error: error
                            });
                            return;
                        }
                        var splitVersion = result['version'].split('.');
                        if (parseInt(splitVersion[0]) > 1) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[1]) > 0) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[2]) > 2) {
                            EIP155Supported = true;
                        }
                        var oldTx = Object.assign(rawTx, {});
                        let input = oldTx.input;
                        return uiFuncs.signed(app, rawTx, ledgerConfig, true, function (res) {
                            oldTx.r = res.r;
                            oldTx.s = res.s;
                            oldTx.v = res.v;
                            oldTx.input = input;
                            oldTx.chainId = "0x1";
                            delete oldTx.isError;
                            delete oldTx.rawTx;
                            delete oldTx.signedTx;
                            web3.fsntx.sendRawTransaction(oldTx).then(function (txHash) {
                                $scope.recallSwapSuccess.open()
                            })
                        })
                    }
                    $scope.notifier.info('Please, confirm transaction on Ledger.');
                    await app.getAppConfiguration(localCallback);
                }
            }
        }
    }


recallSwap
==========

.. code-block:: javascript

    fsntx.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")
    ...

recallSwap destroy a quantum swap and get the asset back
CP see the top SwapID the swap ID password the owner password

----------
Parameters
----------


1. ``RecallSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``SwapID`` - ``common.Hash``: Description

2. ``passwd`` - ``string``: Description

.. note:: Note text.

.. code-block:: javascript

    RecallSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
    	SwapID common.Hash
    }
    passwd string

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")

 .. code-block:: javascript

   $scope.recallSwap = async function (swap_id) {
        if (walletService.wallet !== null) {
            let password = walletService.password;
            let accountData = uiFuncs.getTxData($scope);
            let walletAddress = accountData.from;

            let data = {
                from: walletAddress,
                SwapID: swap_id
            };

            if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
                $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
            }

            try {
                await web3.fsntx.buildRecallSwapTx(data).then(function (tx) {
                    tx.from = walletAddress;
                    tx.chainId = _CHAINID;
                    data = tx;
                    if ($scope.wallet.hwType == "ledger") {
                        return;
                    }
                    return web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                        console.log(txHash);
                        $scope.recallSwapSuccess.open()
                    })
                })
            } catch (err) {
                $scope.errorModal.open();
                console.log(err);
            }
            if ($scope.wallet.hwType == "ledger") {
                let ledgerConfig = {
                    privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : "",
                    path: $scope.wallet.getPath(),
                    hwType: $scope.wallet.getHWType(),
                    hwTransport: $scope.wallet.getHWTransport()
                }
                let rawTx = data;
                var eTx = new ethUtil.Tx(rawTx);
                if (ledgerConfig.hwType == "ledger") {
                    var app = new ledgerEth(ledgerConfig.hwTransport);
                    var EIP155Supported = true;
                    var localCallback = async function (result, error) {
                        if (typeof error != "undefined") {
                            if (callback !== undefined) callback({
                                isError: true,
                                error: error
                            });
                            return;
                        }
                        var splitVersion = result['version'].split('.');
                        if (parseInt(splitVersion[0]) > 1) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[1]) > 0) {
                            EIP155Supported = true;
                        } else if (parseInt(splitVersion[2]) > 2) {
                            EIP155Supported = true;
                        }
                        var oldTx = Object.assign(rawTx, {});
                        let input = oldTx.input;
                        return uiFuncs.signed(app, rawTx, ledgerConfig, true, function (res) {
                            oldTx.r = res.r;
                            oldTx.s = res.s;
                            oldTx.v = res.v;
                            oldTx.input = input;
                            oldTx.chainId = "0x1";
                            delete oldTx.isError;
                            delete oldTx.rawTx;
                            delete oldTx.signedTx;
                            web3.fsntx.sendRawTransaction(oldTx).then(function (txHash) {
                                $scope.recallSwapSuccess.open()
                            })
                        })
                    }
                    $scope.notifier.info('Please, confirm transaction on Ledger.');
                    await app.getAppConfiguration(localCallback);
                }
            }
        }
    }


buildTakeSwapTx
===============

.. code-block:: javascript

    fsntx.buildTakeSwapTx()
    ...

buildTakeSwapTx

----------
Parameters
----------

1. ``TakeSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``SwapID`` - ``common.Hash``: Description
  - ``Size`` - ``*big.Int``: Description


.. note:: Note text.

.. code-block:: javascript

    TakeSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
    	SwapID common.Hash
        Size   *big.Int
    }

-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    $scope.takeSwap = async function (asset_id, swap_id, amount) {
        let password = walletService.password;
        let accountData = uiFuncs.getTxData($scope);
        let walletAddress = accountData.from;
        let toAsset = [];

        try {
            await web3.fsn.getAsset(asset_id).then(function (res) {
                toAsset = res;
            });
        } catch (err) {
            console.log(err);
        }

        let data = {
            from: walletAddress,
            SwapID: swap_id.swap_id,
            Size: $scope.takeAmountSwap
        };

        console.log(data);

        if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
            $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
        }

        try {
            await web3.fsntx.buildTakeSwapTx(data).then(function (tx) {
                tx.from = walletAddress;
                tx.chainId = _CHAINID;
                data = tx;
                if ($scope.wallet.hwType == "ledger") {
                    return;
                }
                web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    console.log(txHash);
                })

                return $scope.takeSwapEndConfirm.open();
            })
        } catch (err) {
            $scope.errorModal.open();
            console.log(err);
        }
        if ($scope.wallet.hwType == "ledger") {
            let ledgerConfig = {
                privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : "",
                path: $scope.wallet.getPath(),
                hwType: $scope.wallet.getHWType(),
                hwTransport: $scope.wallet.getHWTransport()
            }
            let rawTx = data;
            var eTx = new ethUtil.Tx(rawTx);


takeSwap
========

.. code-block:: javascript

    fsntx.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")
    ...

takeSwap buy a quantum swap CP see the top SwapID the swap ID Size the package size password the owner password

----------
Parameters
----------

1. ``TakeSwapArgs`` - ``Object``: Description 

  - ``FusionBaseArgs`` - ``Object``: Description

    - ``From`` - ``common.Address`` - ``json:"from"``: Description
    - ``Gas`` - ``*hexutil.Uint64`` - ``json:"gas"``: Description
    - ``GasPrice`` - ``*hexutil.Big`` - ``json:"gasPrice"``: Description
    - ``Nonce`` - ``*hexutil.Uint64`` - ``json:"nonce"``: Description

  - ``SwapID`` - ``common.Hash``: Description
  - ``Size`` - ``*big.Int``: Description

2. ``passwd`` - ``string``: Description


.. note:: Note text.

.. code-block:: javascript

    TakeSwapArgs {
        FusionBaseArgs {
            From     common.Address  `json:"from"`
            Gas      *hexutil.Uint64 `json:"gas"`
            GasPrice *hexutil.Big    `json:"gasPrice"`
            Nonce    *hexutil.Uint64 `json:"nonce"`
        }
    	SwapID common.Hash
        Size   *big.Int
    }
    passwd string


-------
Returns
-------

``Object``: With the following methods:

    - ``Object``: Description

-------
Example
-------

.. code-block:: javascript

    fsntx.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")

.. code-block:: javascript

    $scope.takeSwap = async function (asset_id, swap_id, amount) {
        let password = walletService.password;
        let accountData = uiFuncs.getTxData($scope);
        let walletAddress = accountData.from;
        let toAsset = [];

        try {
            await web3.fsn.getAsset(asset_id).then(function (res) {
                toAsset = res;
            });
        } catch (err) {
            console.log(err);
        }

        let data = {
            from: walletAddress,
            SwapID: swap_id.swap_id,
            Size: $scope.takeAmountSwap
        };

        console.log(data);

        if (!$scope.account && ($scope.wallet.hwType !== "ledger")) {
            $scope.account = web3.eth.accounts.privateKeyToAccount($scope.toHexString($scope.wallet.getPrivateKey()));
        }

        try {
            await web3.fsntx.buildTakeSwapTx(data).then(function (tx) {
                tx.from = walletAddress;
                tx.chainId = _CHAINID;
                data = tx;
                if ($scope.wallet.hwType == "ledger") {
                    return;
                }
                web3.fsn.signAndTransmit(tx, $scope.account.signTransaction).then(txHash => {
                    console.log(txHash);
                })

                return $scope.takeSwapEndConfirm.open();
            })
        } catch (err) {
            $scope.errorModal.open();
            console.log(err);
        }
        if ($scope.wallet.hwType == "ledger") {
            let ledgerConfig = {
                privKey: $scope.wallet.privKey ? $scope.wallet.getPrivateKeyString() : "",
                path: $scope.wallet.getPath(),
                hwType: $scope.wallet.getHWType(),
                hwTransport: $scope.wallet.getHWTransport()
            }
            let rawTx = data;
            var eTx = new ethUtil.Tx(rawTx);
