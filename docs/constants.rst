============
FSNConstants
============


Constants
============

web3.fsn.consts = { FSNToken: "0xffffffffffffffffffffffffffffffffffffffff",

.. code-block:: javascript

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
    8: "TakeSwapFunc"
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
    "0x0000000000000000000000000000000000000000000000000000000000000008"
};