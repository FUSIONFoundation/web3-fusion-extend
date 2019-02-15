===================
autoPurchaseTickets
===================

.. index:: autoPurchaseTickets

Ticket purchase applicaton
==========================

An application to keep tickets at a constant level built with the web3-fusion-extend package


- `autoPurchaseTicket.js <https://github.com/FUSIONFoundation/web3-fusion-extend/blob/master/examples/autoPurchaseTickets/autoPurchaseTicket.js>`_

-------
Example
-------

.. code-block:: javascript

    node autoPurchaseTicket --c "wss://example.com" -p "./password.txt" -k "./keystore.key" -n 10



.. code-block:: javascript

    -c --connectString web socket gateway to connect to
    -k  --keyStore keystore file to use
    -p  --passPharseFile key file
    -g  -- gasPrice gas price 1 - 100 (defaults to 2 gwei)
    -n  --Number of tickets to purchase