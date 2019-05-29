var old_jsonParse;

exports.extend = function(web3) {
  if (!web3._extend) {
    // simulate the server platform so
    // definitions below can be imported from
    // server unchancged
    web3._extend = web3.extend;
  }

  // FsnJS wacom
  web3._extend({
    property: "fsn",
    methods: [
      new web3._extend.Method({
        name: "getSnapshot",
        call: "fsn_getSnapshot",
        params: 1,
        inputFormatter: [null]
      }),
      new web3._extend.Method({
        name: "getSnapshotAtHash",
        call: "fsn_getSnapshotAtHash",
        params: 1
      }),
      new web3._extend.Method({
        name: "getBalance",
        call: "fsn_getBalance",
        params: 3,
        inputFormatter: [
          null,
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getAllBalances",
        call: "fsn_getAllBalances",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getTimeLockBalance",
        call: "fsn_getTimeLockBalance",
        params: 3,
        inputFormatter: [
          null,
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getAllTimeLockBalances",
        call: "fsn_getAllTimeLockBalances",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getNotation",
        call: "fsn_getNotation",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getAddressByNotation",
        call: "fsn_getAddressByNotation",
        params: 2,
        inputFormatter: [
          null,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "allNotation",
        call: "fsn_allNotation",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "genNotation",
        call: "fsn_genNotation",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "genAsset",
        call: "fsn_genAsset",
        params: 2,
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
              options.decimals < 0 ||
              options.decimals > 255
            ) {
              throw new Error("invalid decimals");
            }
            if (options.total !== undefined) {
              options.total = web3.utils.numberToHex(options.total);
            }
            return web3._extend.formatters.inputTransactionFormatter(options);
          },
          null
        ]
      }),
      
      new web3._extend.Method({
        name: "allAssets",
        call: "fsn_allAssets",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: 'allAssetsByAddress',
        call: 'fsn_allAssetsByAddress',
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: 'assetExistForAddress',
        call: 'fsn_assetExistForAddress',
        params: 3,
        inputFormatter: [
          null,
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "getAsset",
        call: "fsn_getAsset",
        params: 2,
        inputFormatter: [
          null,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "sendAsset",
        call: "fsn_sendAsset",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "assetToTimeLock",
        call: "fsn_assetToTimeLock",
        params: 2,
        inputFormatter: [
          function(options) {
            return web3._extend.formatters.inputTransactionFormatter(options);
          },
          null
        ]
      }),
      new web3._extend.Method({
        name: "timeLockToTimeLock",
        call: "fsn_timeLockToTimeLock",
        params: 2,
        inputFormatter: [
          function(options) {
            return web3._extend.formatters.inputTransactionFormatter(options);
          },
          null
        ]
      }),
      new web3._extend.Method({
        name: "timeLockToAsset",
        call: "fsn_timeLockToAsset",
        params: 2,
        inputFormatter: [
          function(options) {
            return web3._extend.formatters.inputTransactionFormatter(options);
          },
          null
        ]
      }),
      new web3._extend.Method({
        name: "allTickets",
        call: "fsn_allTickets",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "allTicketsByAddress",
        call: "fsn_allTicketsByAddress",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "totalNumberOfTickets",
        call: "fsn_totalNumberOfTickets",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "totalNumberOfTicketsByAddress",
        call: "fsn_totalNumberOfTicketsByAddress",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "ticketPrice",
        call: "fsn_ticketPrice",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "buyTicket",
        call: "fsn_buyTicket",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "incAsset",
        call: "fsn_incAsset",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "decAsset",
        call: "fsn_decAsset",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "allSwaps",
        call: "fsn_allSwaps",
        params: 1,
        inputFormatter: [
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "allSwapsByAddress",
        call: "fsn_allSwapsByAddress",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputAddressFormatter,
          web3._extend.formatters.inputDefaultBlockNumberFormatter
        ]
      }),
      new web3._extend.Method({
        name: "makeSwap",
        call: "fsn_makeSwap",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "recallSwap",
        call: "fsn_recallSwap",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      }),
      new web3._extend.Method({
        name: "takeSwap",
        call: "fsn_takeSwap",
        params: 2,
        inputFormatter: [
          web3._extend.formatters.inputTransactionFormatter,
          null
        ]
      })
    ]
  });

  // fsntx
  web3._extend({
    property: "fsntx",
    methods: [
      new web3._extend.Method({
        name: "sendRawTransaction",
        call: "fsntx_sendRawTransaction",
        params: 1,
        inputFormatter: [null]
      }),
      new web3._extend.Method({
        name: "buildGenNotationTx",
        call: "fsntx_buildGenNotationTx",
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
              options.decimals < 0 ||
              options.decimals > 255
            ) {
              throw new Error("invalid decimals");
            }
            if (options.total !== undefined) {
              options.total = web3.utils.numberToHex(options.total);
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
              options.decimals < 0 ||
              options.decimals > 255
            ) {
              throw new Error("invalid decimals");
            }
            if (options.total !== undefined) {
              options.total = web3.utils.numberToHex(options.total);
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
        name: "buildMakeMultiSwapTx",
        call: "fsntx_buildMakeMultiSwapTx",
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
        name: "buildRecallMultiSwapTx",
        call: "fsntx_buildRecallMultiSwapTx",
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
        name: "buildTakeMultiSwapTx",
        call: "fsntx_buildTakeMultiSwapTx",
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
  });

  web3.fsn.__defaultChainId = 88666

  web3.fsn.setDefaultChainId = function(chainId) {
    web3.fsn.__defaultChainId = chainId;
  };

  web3.fsn.signAndTransmit = function(tx, signer) {
    var input = tx.input;
    if (!tx.chainId && web3.fsn.__defaultChainId) {
      tx.chainId = web3.fsn.__defaultChainId;
    }
    var rawTx = Object.assign(tx, {});
    return signer(tx).then(signedMessage => {
      let { r, s, v } = signedMessage;
      rawTx.r = r;
      rawTx.s = s;
      rawTx.v = v;
      rawTx.input = input;
      if (!rawTx.chainId) {
        if (tx.chainId) {
          rawTx.chainId = tx.chainId;
        }
      }
      if (!rawTx.gasPrice) {
        if (tx.gasPrice) {
          rawTx.gasPrice = tx.gasPrice;
        } else {
          rawTx.gasPrice = web3.utils.toWei(new web3.utils.BN(2), "gwei");
        }
      }

      return this.fsntx.sendRawTransaction(rawTx).then(txHash => {
        return txHash;
      });
    });
  };

  web3.fsn.signAndTransmit = web3.fsn.signAndTransmit.bind(web3);

  web3.fsn.getHexDate = function(d) {
    return "0x" + (new Date(d).getTime() / 1000).toString(16);
  };

  web3.fsn.hex2a = function(hexData) {
    hexData = hexData.replace("0x", "");
    let hex = hexData.toString(); //force conversion
    let str = "";
    for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  };

  web3.fsn.enableBigIntJSONParse = function() {
    if (!old_jsonParse) {
      old_jsonParse = JSON.parse;
      JSON.parse = function(str) {
        let newObj = old_jsonParse(str.replace(/:([0-9]{15,}),/g, ':"$1",'));
        return newObj;
      };
    }
  };

  web3.fsn.consts = {
    TimeForever: 0xffffffffffffffff, // javascript will convert this to 0x10000000000
    TimeForeverStr: "0xffffffffffffffff",

    FSNToken:
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",

    OwnerUSANAssetID:
      "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",

    TicketLogAddress: "0xfffffffffffffffffffffffffffffffffffffffe",
    TicketLogAddress_Topic_To_Function: {
      0: "ticketSelected",
      1: "ticketReturn",
      2: "ticketExpired"
    },

    TicketLogAddress_Topic_ticketSelected:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    TicketLogAddress_Topic_ticketReturn:
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    TicketLogAddress_Topic_ticketExpired:
      "0x0000000000000000000000000000000000000000000000000000000000000002",

    FSNCallAddress: "0xffffffffffffffffffffffffffffffffffffffff",

    FSNCallAddress_Topic_To_Function: {
      // GenNotationFunc wacom
      0: "GenNotationFunc", // = iota
      // GenAssetFunc wacom
      1: "GenAssetFunc",
      // SendAssetFunc wacom
      2: "SendAssetFunc",
      // TimeLockFunc wacom
      3: "TimeLockFunc",
      // BuyTicketFunc wacom
      4: "BuyTicketFunc",
      // AssetValueChangeFunc wacom
      5: "AssetValueChangeFunc",
      // MakeSwapFunc wacom
      6: "MakeSwapFunc",
      // RecallSwapFunc wacom
      7: "RecallSwapFunc",
      // TakeSwapFunc wacom
      8: "TakeSwapFunc",
      // MakeSwapFuncExt wacom
      9: "MakeSwapFuncExtOld",
      // MakeSwapFuncExt wacom
      10: "MakeSwapFuncExt",
      // TakeSwapFuncExt wacom
      11: "TakeSwapFuncExt",
      // AssetValueChangeFunc wacom
      12: "AssetValueChangeExtFunc",
	// TransferNotationFunc wacom
	TransferNotationFunc
	// MakeMultiSwapFunc wacom
	MakeMultiSwapFunc
	// RecallMultiSwapFunc wacom
	RecallMultiSwapFunc
	// TakeMultiSwapFunc wacom
	TakeMultiSwapFunc
    },

    FSNCallAddress_Topic_GenNotationFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    FSNCallAddress_Topic_GenAssetFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000001",
    FSNCallAddress_Topic_SendAssetFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000002",
    FSNCallAddress_Topic_TimeLockFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000003",
    FSNCallAddress_Topic_BuyTicketFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000004",
    FSNCallAddress_Topic_AssetValueChangeFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000005",
    FSNCallAddress_Topic_MakeSwapFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000006",
    FSNCallAddress_Topic_RecallSwapFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000007",
    FSNCallAddress_Topic_TakeSwapFunc:
      "0x0000000000000000000000000000000000000000000000000000000000000008",
    FSNCallAddress_Topic_MakeSwapFuncExtOld:
      "0x0000000000000000000000000000000000000000000000000000000000000009",
    FSNCallAddress_Topic_MakeSwapFuncExt:
      "0x000000000000000000000000000000000000000000000000000000000000000a",
    FSNCallAddress_Topic_TakeSwapFuncExt:
      "0x000000000000000000000000000000000000000000000000000000000000000b",
    FSNCallAddress_Topic_AssetValueChangeExtFunc:
      "0x000000000000000000000000000000000000000000000000000000000000000c",

    EMPTY_HASH : "0x0000000000000000000000000000000000000000000000000000000000000000"
  };
  return web3;
};
