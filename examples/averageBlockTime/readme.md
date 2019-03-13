
# Average Block Time Example

### Overview

The following application demonstrates how to calculate block times against the fusion chain.

You will need an environment string called CONNECT_STRING to connect to a gatweway to read blocks

It can be passed on the command line.

Remember to run npm install, to install runtime dependecies

```
npm install
```
You can then run the application via:

```
CONNECT_STRING="wss://gateway.fusionnetwork.io:10001" node averageBlockTime.js 
```
