.. _fsn-fsntx:

.. include:: include_announcement.rst

=====
fsntx
=====

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

sendRawTransaction

-------
Example
-------

.. code-block:: javascript

    fsntx.sendRawTransaction()


------------------------------------------------------------------------------

buildGenNotationTx
==================

buildGenNotationTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildGenNotationTx()


------------------------------------------------------------------------------

genNotation
===========

genNotation

-------
Example
-------

.. code-block:: javascript

    fsntx.genNotation()


------------------------------------------------------------------------------

buildGenAssetTx
===============

buildGenAssetTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildGenAssetTx()


------------------------------------------------------------------------------

genAsset
========

genAsset

-------
Example
-------

.. code-block:: javascript

    fsntx.genAsset()


------------------------------------------------------------------------------

buildSendAssetTx
================

buildSendAssetTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildSendAssetTx()


------------------------------------------------------------------------------

sendAsset
=========

sendAsset

-------
Example
-------

.. code-block:: javascript

    fsntx.sendAsset()


------------------------------------------------------------------------------

buildAssetToTimeLockTx
======================

buildAssetToTimeLockTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildAssetToTimeLockTx()


------------------------------------------------------------------------------

assetToTimeLock
===============

assetToTimeLock

-------
Example
-------

.. code-block:: javascript

    fsntx.assetToTimeLock()


------------------------------------------------------------------------------

buildTimeLockToTimeLockTx
=========================

buildTimeLockToTimeLockTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildTimeLockToTimeLockTx()


------------------------------------------------------------------------------

timeLockToTimeLock
==================

timeLockToTimeLock

-------
Example
-------

.. code-block:: javascript

    fsntx.timeLockToTimeLock()


------------------------------------------------------------------------------

buildTimeLockToAssetTx
======================

buildTimeLockToAssetTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildTimeLockToAssetTx()


------------------------------------------------------------------------------

timeLockToAsset
===============

timeLockToAsset

-------
Example
-------

.. code-block:: javascript

    fsntx.timeLockToAsset()


------------------------------------------------------------------------------

buildBuyTicketTx
================

buildBuyTicketTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildBuyTicketTx()


------------------------------------------------------------------------------

buyTicket
=========

buyTicket

-------
Example
-------

.. code-block:: javascript

    fsntx.buyTicket()


------------------------------------------------------------------------------

buildIncAssetTx
===============

buildIncAssetTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildIncAssetTx()


------------------------------------------------------------------------------

incAsset
========

incAsset

-------
Example
-------

.. code-block:: javascript

    fsntx.incAsset()


------------------------------------------------------------------------------

buildDecAssetTx
===============

buildDecAssetTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildDecAssetTx()


------------------------------------------------------------------------------

decAsset
========

decAsset

-------
Example
-------

.. code-block:: javascript

    fsntx.decAsset()


------------------------------------------------------------------------------

buildMakeSwapTx
===============

buildMakeSwapTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildMakeSwapTx()


------------------------------------------------------------------------------

makeSwap
========

makeSwap

-------
Example
-------

.. code-block:: javascript

    fsntx.makeSwap()


------------------------------------------------------------------------------

buildRecallSwapTx
=================

buildRecallSwapTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildRecallSwapTx()


------------------------------------------------------------------------------

recallSwap
==========

recallSwap

-------
Example
-------

.. code-block:: javascript

    fsntx.recallSwap()


------------------------------------------------------------------------------

buildTakeSwapTx
===============

buildTakeSwapTx

-------
Example
-------

.. code-block:: javascript

    fsntx.buildTakeSwapTx()


------------------------------------------------------------------------------

takeSwap
========

takeSwap

-------
Example
-------

.. code-block:: javascript

    fsntx.takeSwap()


------------------------------------------------------------------------------

