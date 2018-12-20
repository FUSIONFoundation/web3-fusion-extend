#Ticket purchase applicaton
  - [autoPurchaseTicket.js ](./autoPurchaseTicket.js)

An application to keep tickets at a constant level
built with the web3-fusion-extend package

Example: node autoPurchaseTicket --c"wss://example.com" -p "./password.txt" -k "./keystore.key" -n 10

              -c --connectString web socket gateway to connect to
              -k  --keyStore keystore file to use
              -p  --passPharseFile key file
              -n  --Number of tickets to purchase

