.. _calculateMiningReward:


==============
calculateMiningReward
==============

.. index:: _calculateMiningReward


Calculate Mining Reward Example
===============================

An example on how to calculate mining rewards can be found in:


- `calculateMiningReward.js on github <https://github.com/FUSIONFoundation/web3-fusion-extend/blob/master/examples/calculateMiningReward/calculateMiningReward.js>`_.
 

-------
Example
-------

Calculate Mining Reward Example


Overview

The following application demonstrates how to calculate mining rewards against the fusion chain.

You will need an environment string called CONNECT_STRING to connect to a gatweway to read blocks

It can be passed on the command line.

Remember to run npm install, to install runtime dependecies

.. code-block:: javascript

    npm install

You can then run the application via:

.. code-block:: javascript


    CONNECT_STRING="wss://gateway.fusionnetwork.io:10001" node caculateMiningReward.js 
