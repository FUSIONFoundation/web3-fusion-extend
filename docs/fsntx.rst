
.. include:: include_announcement.rst

=====
fsntx
=====

FSNTX commands
==============

    personal.unlockAccount( eth.coinbase, "123456" ) 
    var tx = fsntx.buildBuyTicketTx( {from:eth.coinbase} ) 
    tx.from = eth.coinbase 
    var tx2 = eth.signTransaction( tx ) 
    fsntx.sendRawTransaction(tx2.tx)

.. code-block:: javascript

    // fsntx
web3._extend({
  property: "fsntx",
  methods: [
    new web3._extend.Method({
      name: "sendRawTransaction",
      call: "fsntx_sendRawTransaction",
      params: 1
    }),
    new web3._extend.Method({
      name: "buildGenNotationTx",
      call: "fsntx_buildGenNotationTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "genNotation",
      call: "fsntx_genNotation",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildGenAssetTx",
      call: "fsntx_buildGenAssetTx",
      params: 1,
      inputFormatter: [
        function(options) {
          if (options.name === undefined || !options.name) {
            throw new Error("invalid name");
          }
          if (options.symbol === undefined || !options.symbol) {
            throw new Error("invalid symbol");
          }
          if (
            options.decimals === undefined ||
            options.decimals <= 0 ||
            options.decimals > 255
          ) {
            throw new Error("invalid decimals");
          }
          if (options.total !== undefined) {
            options.total = web3.fromDecimal(options.total);
          }
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "genAsset",
      call: "fsntx_genAsset",
      params: 1,
      inputFormatter: [
        function(options) {
          if (options.name === undefined || !options.name) {
            throw new Error("invalid name");
          }
          if (options.symbol === undefined || !options.symbol) {
            throw new Error("invalid symbol");
          }
          if (
            options.decimals === undefined ||
            options.decimals <= 0 ||
            options.decimals > 255
          ) {
            throw new Error("invalid decimals");
          }
          if (options.total !== undefined) {
            options.total = web3.fromDecimal(options.total);
          }
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "buildSendAssetTx",
      call: "fsntx_buildSendAssetTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "sendAsset",
      call: "fsntx_sendAsset",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildAssetToTimeLockTx",
      call: "fsntx_buildAssetToTimeLockTx",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "assetToTimeLock",
      call: "fsntx_assetToTimeLock",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "buildTimeLockToTimeLockTx",
      call: "fsntx_buildTimeLockToTimeLockTx",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "timeLockToTimeLock",
      call: "fsntx_timeLockToTimeLock",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "buildTimeLockToAssetTx",
      call: "fsntx_buildTimeLockToAssetTx",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "timeLockToAsset",
      call: "fsntx_timeLockToAsset",
      params: 1,
      inputFormatter: [
        function(options) {
          return web3._extend.formatters.inputTransactionFormatter(options);
        }
      ]
    }),
    new web3._extend.Method({
      name: "buildBuyTicketTx",
      call: "fsntx_buildBuyTicketTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buyTicket",
      call: "fsntx_buyTicket",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildIncAssetTx",
      call: "fsntx_buildIncAssetTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "incAsset",
      call: "fsntx_incAsset",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildDecAssetTx",
      call: "fsntx_buildDecAssetTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "decAsset",
      call: "fsntx_decAsset",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildMakeSwapTx",
      call: "fsntx_buildMakeSwapTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "makeSwap",
      call: "fsntx_makeSwap",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildRecallSwapTx",
      call: "fsntx_buildRecallSwapTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "recallSwap",
      call: "fsntx_recallSwap",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "buildTakeSwapTx",
      call: "fsntx_buildTakeSwapTx",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    }),
    new web3._extend.Method({
      name: "takeSwap",
      call: "fsntx_takeSwap",
      params: 1,
      inputFormatter: [web3._extend.formatters.inputTransactionFormatter]
    })
  ]
