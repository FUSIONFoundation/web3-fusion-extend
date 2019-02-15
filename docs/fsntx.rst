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

    fsntx.sendRawTransaction()


buildGenNotationTx
==================

.. code-block:: javascript

    fsntx.buildGenNotationTx()
    ...

buildGenNotationTx

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

    fsntx.buildGenNotationTx()


genNotation
===========

.. code-block:: javascript

    fsntx.genNotation({from:fsn.coinbase},"123456")
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

    fsntx.buildGenAssetTx()


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

    fsntx.buildSendAssetTx()


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

    fsntx.buildAssetToTimeLockTx()


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

    fsntx.buildTimeLockToTimeLockTx()


timeLockToTimeLock
==================

.. code-block:: javascript

    fsntx.timeLockToTimeLock({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",start:"0x101",end:"0x200",value:"0x100"},"123456")
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

    fsntx.buildTimeLockToAssetTx()


timeLockToAsset
===============

.. code-block:: javascript

    fsntx.timeLockToAsset({asset:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",from:fsn.coinbase,to:fsn.coinbase,start:"0x0",end:"0x0",value:"0x100"},"123456")
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

    fsntx.buildBuyTicketTx()


buyTicket
=========

.. code-block:: javascript

    fsntx.buyTicket({from:fsn.coinbase},"123456")
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

    fsntx.buildIncAssetTx()


incAsset
========

.. code-block:: javascript

    fsntx.incAsset({from:fsn.coinbase,to:"0x2b1a3eca81ba03a9a4c95f4a04679c90838d7165",value:"0x1",asset:"0x514a46f34e6eb0a98abb3595c4aec33ca8ddf69f135c8fed89e78d0808047965"},"123456")
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

    fsntx.buildMakeSwapTx()


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

    fsntx.buildRecallSwapTx()


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

    fsntx.recallSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"},"123456")


buildTakeSwapTx
===============

.. code-block:: javascript

    fsntx.buildTakeSwapTx()
    ...

buildTakeSwapTx

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

    fsntx.buildTakeSwapTx()


takeSwap
========

.. code-block:: javascript

    fsntx.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")
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

    fsntx.takeSwap({from:fsn.coinbase,SwapID:"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",Size:"0x1"},"123456")


