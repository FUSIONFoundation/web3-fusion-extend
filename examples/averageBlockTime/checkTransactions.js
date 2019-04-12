
let transToCheck = [
"0xfeeaf32c3619c42847cafcc28b24bb3804387db9cf42b6af758149da6e55caad",
"0xead6675d262f8ecea5e49d340bcc0e8e304a84ca304bc310aa4b45fbc8bdffc2",
"0x9d956cdf3c6aaa27e6109ba8ff4265991e13c5f196e98bdecc0dde9ff2f078a4",
"0xa13b647c8889cfe5e16ed85318fcbec79536dcae4a0dbc3ba2038d58e5c805a8",
"0x04d8344992bef4e105b8191c08a11e37ad8030bc90084627e74f63498ac6c831",
"0x8a412a4cc45f9d7d911bc2f31cf457f7bf83e28ca3459200bbbbf3f440d7bf75",
"0xb736dcc38996eb80312865ab20578c208a075569e050bae1191375e461be157e",
"0x8e89ea0e59ec97b62b699687b5fc21bc6e7199a94f579d67efb443a6a42f4030",
"0xe4902d30b38babb877cb87730ff9eb00121d69f692379c6c75fed72ec61b8803",
"0xfdd5505a9172f3d41c1e403a21ec009e80173f36a06c1b06c8518ed88bbe5905",
"0x019f3e4f3fdcf05b65f8d7f533fca7029a84ece5a631a9ec0dc4a4175d0ac8a6",
"0xe0225048dc8164b92c28e0036fcecd5a521ddce338d783fe79026778a713869c",
"0x49648d41fc466d298aa80d0bd6ac5e001ce08c4ce2985f8e10acbe13d1614a24",
"0x5083b06ed125dea92e9c7bca4a5b0e54b4f748248da5768c9ca36cac909f83b0",
"0xe4643caba9ab4a71d46d1581852e8073574e71dd87e50317ded71e002917c16e",
"0x6552010aa15600558f3652d31850b36e0e6196f10102956688572011cb559461",
"0x93fa863be63a23756a8c25a2cb49c66b9b553fa67bbbcdab179f8fb09abc24aa",
"0xa35c6e9fcdb29f2b98143521518e93d5c16fe60874b30e9eb51e178ab562e456",
"0xb6f6bc770f2f175ea9a2283a923fb9a86dbfc1687a97c55b10869d078cca7396",
"0x0f048c13609564dce86c7d58813441b38663970fdfdf92a74e00beffbd2a6de5",
"0xca685dc4434ea617c78424f65a49d3c203add8e57aa00a27452c2abb08286d86",
"0x565086125dd42d1953f38b08512ce894e6e868155947801decee43259ff6050e",
"0x9059769230330072d76bf38f0ce8982fe900e7d726ab967307f1124c7fcc4970",
"0x8e3269fabb1b6761751b693e74844679684e8903260abff76c79d72373b7e9c1",
"0xce5cb92ba26bd09d773e0ea91e348cfaa419de73f8a90287edf25368c8a040f3",
"0xb1e5fbe99d3bad1d1e042ae245a099ed38dc7280eb9cfa56a0de3ecb31e6d2b1",
"0xe98a848da4732df8d4fee7eebc418d82ffd8c39c14e434d51aef2b3f80ba154f",
"0xb91bccbfc57804cafb382352f4ce102f910345e02f0cc6227a9e977a28134cb3",
"0xcb8de9cab3dc1048004916adcfadec3205324f31b475870f70748a3119537d90",
"0x9709526a49266bda9127d208671fc6e7e78786e6e1ca03e4b098b1f42c82601d",
"0x4f6cbfea4b1d2aec8a01b2da177a1845ecaa8df9f9c30150b8481ab1bc0132c4",
"0xf934b7b7128f9a44c9fe6a1fc54acbf2fda9215bd53e068435829f7d87adf559",
"0xb76fe81bf8b7d6ada7e5b9af015585144995d17673916428a25dfc1f345f831b",
"0xb4a5b9c92bb4be84644909471d204c414cd0671501c40e41abe22fc1eda2b448",
"0xb538959433cd4c9f110b00fe3c82862a37d0b20da3048d1793863e7a540302fa",
"0xab9d4307d4cb36b1a5e5dec7b33723d3f8e4e68156f725a850830e9f1a1ec082",
"0x44f3ef8d84728fd7a527303ea82a96089f4ff43f6ceb4dc84972e198fc474864",
"0x46fefbd9f4d68935e91f52e3ab77f6f1eb448b3868f6b3cdb30c6a28b055168b",
"0xd35a510af1563057b47bc74f6a1cce65767f0a1859620332c7699ebd342ad171",
"0x42f1a227dbe954f7de5b2eb418f47ca130c934a658ab7beb54d937719ac21c1a",
"0x8bc23642441e89d9cc3c5f050cf22e95f7b41feb1e3b308f1a6a086511f70758",
"0x8a09d87be2492d0d18a5aea007d69ed0b35de2b92e64fa4ceb05ecf7b9bb7c32",
"0x3bf11cb5b1c359abc696ff7134b1b3afe3e9748836876516a3b3a0c3c422d8cf",
"0x668ec371559a7fb240bfd5afa14e51e5eee8d4c2bc51366dd95d21b487bb19bc",
"0x2d93a186bedadf0164f0a341ba0992baf04be26eaa57ce21bff4e7a004767627",
"0x43a87d0663bf1c7137fd3e3b7383e0b2e98dea0b7166e64a3221f234a3699cc7",
"0xce875474d954f8da7d9d13249bae4db7c973e9d3af1f6c82af23bb2caf31409a",
"0x7cfac73af083949ebd8730104c5ff202cdc9a14ff2e86b8d8f88000acce85f84",
"0x4c71c48ceca242560984f4cd363afb67d956bd8eb193d5fa86dbd979fda4fbd2",
"0x08e96177a961724ea6d76c438d10bb60f2c756ccd0a9a3f3c1bad507ff6e1370",
"0xd6fc49c61574079a1ad73f78142448e8cc12798c1e7af6d4ccf9dc0a3be42028",
"0x15601f8a9b13619690c520f95cce65e8d969a7b43e02bf795524208ecdafee15",
"0xc396ddb5d247a627bbafb777f2ce3201969979f1aa9e55f2a03fdf332412494d",
"0xc4dbbc861bf6f664c0225fa07f77894682a6a811889ff75645d51b2340c95c7d",
"0x35f6b481bad0e2ce43a63089a4d1d78fd86b8a6d738ac28ccd3a99994e41b06d",
"0x85c844ca9e6c0f34d1ad22a3a0417dc42b11bcbd58a62d6062d2be09ea7c6d22",
"0xbd4c4b8adbbb53f4efba7306b0325a2ec33fe209a972e2363efa4506bc7714d2",
"0xbf5461beb63002b9b29a09afc32a972a3cd56d693fe4038d719b4465e30784c2",
"0x1094a6af97afff3ceef4f1ab35791a47e012447f2f1e6844e51e8b7a20ecb7bf",
"0xabf6d204aab99d190214ef730442c5d22128c4b4f7582ee343b1ed980864f156",
"0x82a88327fbfca4f3b1ea23348db67b26ac2fa1b82ad42bba50441382698f5271",
"0x6062d4759d76090b2fe770c5e48c59ee5af7bd474b9293d011b2f5d1eb478f09",
"0xb0202ec3d9d63c364c5faae58133c2cf0bb03072d00e84dc5d1416d5540a557a",
"0x00b6c794ffa981d32fa92508f360505628055bea4dc94e81b4a54b1100bdb4aa",
"0x7c0acfe13ccf24953fc4148322eb280d57ea73d0c6ac49e9cd04100150f8102f",
"0x9efda927d3cb5ba239cde86008a637fe539f73096b5a63571ae58b1c7fc61569",
"0x7c0b8f4203140273c765481f71bdd91764225b7b080095b7772a6e299d629350",
"0x8fd83806e2f7c2674a0aaa238b3feb49818d5a9a7c32e7b21627fb6a47258be1",
"0xad6a7fa6f2e6db1a1b9a08b114a7533526f4015b52e07467845357dd17875095",
"0xf0ddc8c160af2fe4eae4ded83191692f940d4134b5771f87644c51f0f58c4906",
"0xe758c8f3d073d133f4473caa04dc89ad6a4cabe89ce06e6c52866772186fe87a",
"0xbb4ed22427ece6eba4817f22ee0a4de8beaab7ec32212fbb36ccd67057647904",
"0xb659aba818df409521a067d11fff43eeb07e664e76c3913229ec756dc5062c1b",
"0xd6e6cb147f1683bb6fb66ef981b7c3301b6d5fa09332fabf45453e75d5ebfee1",
"0x8211d445a7c0a392bbc6bac52edb9c5f7cf4ed02757ee09b20ce80a51ba1f18e",
"0xe871de64048f902e8adc7cf1db5ed33e8467f962b2ff2e2e03c4ad908b749aa0",
"0xa98400d9741c7222619bf63fb8be68810bf8cd797117af35a67658eadab2e89f",
"0xcbd23cec24166ca3f2e0d4223906ee9ba068fc72a19365e668b9e8905612db7f",
"0xb3e0de51f9b39fa3b199d5c15f3d25c23fa2b9c5a7107411f4db675ccbc8e582",
"0xd7abc7fa1a278929bd7f3860ec0d49974c83a4fed3e4a194003381f05fbe4219",
"0x6c1690d57b4c2b7bbfe0012d0cdc8b49bdfa2c0e004e602ad70c4a1fe9f01e3a",
"0x1011621a852e4a2d29592972191a8231aa60cd4ab7216a73d8f2acf2f62275d5",
"0x4c6523a151ed86155e5d526369364d201ea997175f7a41ba04b538d7f4176676",
"0xbbda578e7963768e58fefad8d93f0d3f1b80ba3b998a689321629c606c6d0581",
"0xb37a0762552f45efabd48cfa330f6c1e58a8d98c6e85e7989c6373bcd1f94ba4",
"0x07993661b80a3fd52933b7d7f79e7e0892397f8eb4b4abe9a4cb4d0d30f2598e",
"0x2a1fcb3e103001dfec6c9d5be6ccbfc042e92e06796b9944f7c5471f2538c321",
"0x690895c12cb318240178f4c51d9166ad814dc096b67f4f0b180dff3eafa515ad",
"0x08f3e21d70c5ee1c6d4d8fbb3a17ffa5704a2b57356708c1ee4aec8947b216db",
"0x360f86a069ec68a2ab17c105c1d08abf502d2c074e0ef1e04236edea580e3d1b",
"0xa5143ab7a9fb6d1479f2f8901aa43fb41688b1a3baa1dc8a2c44e90f46d10d5a",
"0xc6ceadf589b4d2a5984c7a6c98a47868c9e4c65b2afde03582862efa87656f35",
"0x6c8a8690a9b047c517a9cdde7d3805d1a89cb7c60966f5d07a143a8fc9321b19",
"0x277816ecc9466e53cb98e71954ae636fce7f3f0cb6109e9d6dda84fd271077c9",
"0x2c8d766bcb302926edfc61bc2121c5f89cbdd55421667042da94bab9b8bf0267",
"0x68486e1fdb4531ca5f984ab4a63a0005462662d1a846a0ccf94b124a670a6857",
"0xd68dbde4e894bdeb3415bfefb3354ba1005305451f6bd60ef18880fd087d6896",
"0xd1e984c476b93f12d157c2a8da4cf8e893aa1b421d09d00e402f95a03ebaa368",
"0xb80c45d310876c78db24ac19d29d6294a0e123ae70162c43282371ac4ee4735a",
"0x39b01114cca562257f67c42df0165bfce3a27c46776b7910d129c20ac2c64c55",
"0xc9ec901e3b7d8fcb13e73483d9138bce23ee73622ec77b2694154d16035fa401",
"0x1b45a91d4a281c6c3e895e7ee62092333e309a2743da6fb911ea4545553e6bb8",
"0xa038fca319cff076a360384e401ad104955f38440b9f2ab8b09305ae70c1f25e",
"0xbb27e5c2951a95151b54b9099f19f10ffcd3f984e5fdb00e885c5604d497d66a",
"0x800b3966c5eefe520f0fe6f88c01730cfe880a5226c9d706a9ed92d757d14fe8",
"0x7f5c9aeb9a0982ed4f5cb596825c196d9718457cff463842f5af68bf1bda847f",
"0xb35e7a34891c169eab4e24bbf0b88dc85dacbd6055b8bbb1fbecce1146e7ac06",
"0x1139fd486353a0781bea3e7e3f6bf0df18cc36991599b89d4fc1314b94726da4",
"0x9a49dea9c3c045830ada6774661eb6c5347f9e8fa6ca356b0b22224f8eff8804",
"0x1e022a024e401add407cb2d2c5498e38c8162ec95ce1ae5a7807c095997ef61e",
"0x3c006b73c5c8c73ac8849cc45ed1c9a5f7c00c984d9aef46df5dd4fcf2c1a4f6",
"0x2df06cbc5d9936a0fe853c5aa11a1487a64bd92a1be3ae67351324f690c70a4c",
"0xf6dbc8685f89f8dfcdeb8fb4d7bbf17523c2061abf9847b39a7dce4b4ac25e6d",
"0xb7b1e243fa85b56f510564498628e4593a744b9dcccbb40d6bd284497571ace8",
"0x8c393058fe2614ea974a4f2330971a51b63de16bacdae5adce6d02374a9f3781",
"0x06a0d71582691a7de2305f3b61f137b4ca3c9e04af396ac6498afdb8b03d7e7d",
"0xabca0ac72d96b65d3b442ce34bcc2abb610903ba8a86c4346a7883ae876fdfd2",
"0x730f2cc7e57266f6302d4949f10aa3c50c10011e94863084c5c38e94deac9221",
"0xc41c698c13ede4d14f9abb302a08fb7ebc418b90109279a9fa91c8bdbba49b14",
"0x7aafa5a0fee25aa46c5e071d06ae3c0262fa71d821b264a2fcad3004bb0c7c9b",
"0x46958f7475af797ab22dd5069f1287eee9f4acdb2418394312d7b3c0389685b2",
"0x047b50a5da3bc7a94d91f2ab83a066c5c9fa17c4eb8a12d7736a0a33d03e0576",
"0x1a6149affe63212d26a2e864fceb05d662c91d6ffefde4241d2662888d749926",
"0x7a5fc40db49e699bec8115a0c307fcc74b86f6e2c65a014a44638a6b3e9a6da4",
"0x4c318b5e16b23119695001df08889fcb73e327031ae1445026b7feab2fecace4",
"0xddb2663a0912b3e736cac889c9c046955483ff847eee60366c400c4936c39483",
"0x75775f49eb61c0d21e503104cb3f31dc12c2e23646cc151bc21c97430de659ef",
"0x425ba899d8c1bb367f0cb1ee8b852b15bbbb545fc0d6e1274a7efa403a8be03a",
"0x73a64422d92cce194384a8efe43416eb725058769a13bb906ef7ea59d5771ce1",
"0x22b87afe7721ca8ecb64171412b1d15d9e70d4dc08499dcea28da2a66354cd7a",
"0x38b17b7b70064cba80d547a5611fe565cf759f3621c961f925852adf3e15690b",
"0xc16a836423f415bc33be951588c98ef88c18c27df40a6753543d70df8d9dc623",
"0x76ad312770c98c6ffa7a489fc64e935b8fdfd36239012d59fb6a877d01ba1cae",
"0x335c0814d160d3ae62d6624c36e3a5e98860630d8d0d6544e54e4fb401955072",
"0x616f637e70794bb37d9bd375768f50954ea82de4c39b26518dede4ed219fa5a0",
"0x53555a8ee957a9f24925c69f511f6cf4a2867f0a9eb872fddadf762c5ccfef4d",
"0x40e4d0c2fc5f13484c6c6c6e55c59d1431a4e0d78be7fe69f1d27eed44ae1bfd",
"0xfa95f736a272c603c61c85fcc660eb81a71743dd209503c8a1eae37e4ceb6153",
"0x29694c6310ca639de76d4ec2d70415dbf55936a6d33eefbe59d5529f41c52a41",
"0x224a6222f43a171b6e875fbaad8f2713485c9986c6c024cc7318b2f4e6f28fd2",
"0xe4db4e5439c5cb96553513dbf08fba143e24b5b8118fe01088ef6340425f4526",
"0xbdaca53d1d9e0a0cb5b87bdff2590a924234a0578d9c171305549d4ff0422643",
"0x0b53cc45aaba120a39a3945160a99b62e10ac8e60270bd23e6f4bfdc7b16cb1e",
"0x9ea172f9ccdf78f9147aa1e772420e8a79ed9815f7171f85e0a27d8ce2fb9e68",
"0x086760caad8e596edd087165c83a9bc69f01ea5446ac8255ec3e0ec7357c7382",
"0x856313ad20ed21623e74fa7fe9c33097f5c32203387379701f6acecedd6dadb0",
"0x3fa6bbe092450baa6f43461fdcde7dd1010219139d08efe429f1395c596585f6",
"0x3189b569e3d56cd43481a0412458a0b229d838a934f2618d9816d1efac0b74f3",
"0x26afb248c7665fa213f597146d175961672fdd750c87f7e2c79e6b9b3f220e12",
"0x7b3bc4b7da68ec9bfdc455d5fc554f51d31d22744821a270b63e61ea56b78326",
"0xe78f939af9b62e76a3113c51ae0633c5378efdfc5a59328daba428b320322f3d",
"0xb0d1823bb3d159a027ba36b65e78bc2418c55ce27b83074ae58a793f411b23f2",
"0x156d50f1fc69d4d7062df0f63352ae216848d451bf1f5398c2815fd52fc04c40",
"0x151f1b8ffaf9321376375afbf2585cb5e17ae4f3d1fd0877e5d1700c2d3ab79a",
"0x7526f14d3e2f78b619fc3c96129f39e6b19d1392b2ada489a5420607f25fcabd",
"0x50df920d6a26ffb7c5705c1669c24de9bb935e68d4c25723f77b2651d86a4bfa",
"0xfa8aec798ae7a83718a85378625bead57c09904f2437b9105a47f7226e72b949",
"0x2139c80de812e68e83557021d0bf9bcf2b4bbde36649081f4cb11f09293a5e25",
"0xb9dde01983d1628a3f3cb056bb025011e2e1f9056766a1d5e1cb2d28c36ff1f5",
"0x72933dd7b800a53fad340cab074e69c5d953ca0631a480e38a01d30d761e79d9",
"0x4510853ea5681961543dca287fcc991e7d613804ce81d9509471a95b23dd9d0d",
"0xdde41ef184b419000f71abc6a1fa0c5ba255605e71a0ed9c2a55a05660f32f4e",
"0xd8b7cbe0c33ec9e375af4d7b3f30d155c501fe3defd199ebf8fff08c0a013c3e",
"0xa5d6bc1a3efdf39a4cf2ef95824cf7d8273073f5097298a2bd4ca2d0d10c92a1",
"0x969efd8655603302ccd4e095169ea1d4b566007c1268d9dbff8db1c666593fec",
"0x717f4e2de179fe72284d38d82dcb9b578359b5a137c52f3771316ea7050d922d"
]

/** checkTransactions.js
 *
 * example to how mining rewards can be calculated
 *
 */
const rp = require("request-promise");
var Web3 = require("web3");
var web3FusionExtend = require("../../index.js");

let index = 0

let version = 1.0;
let timerSet;

let dataprocessing = false 


/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="wss://testpsn2.fusionnetwork.io:10001"

    else the default will be "wss://testpsn2.fusionnetwork.io:10001"
*/

var web3;

const BigNumber = require('bignumber.js');

BigNumber.config({ DECIMAL_PLACES: 18,  EXPONENTIAL_AT: [-19, 20] })

let total = new BigNumber( 0 )

let connectString = process.env.CONNECT_STRING;
if (!connectString) {
  connectString = "wss://testpsn2.fusionnetwork.io:10001";
}

let blocks = {   }

/** the following function helps us connect and reconnect to the
 * gateway specified
 */
let lastConnectTimer;
function keepWeb3Alive() {
  if ( dataprocessing ) {
    return
  }
  //debugger
  lastConnectTimer = null;
  console.log("STARTING WEB3 connection");
  provider = new Web3.providers.WebsocketProvider(connectString, {
    timeout: 60000
  });
  provider.on("connect", function() {
    //debugger
    web3._isConnected = true;
    web3.fsn.enableBigIntJSONParse();
    scheduleNewScan(10);
  });
  provider.on("error", function(err) {
    //debugger
    if ( dataprocessing ) {
      return
    }
    if (provider && !provider.___disconnected) {
      provider.___disconnected = true;
      provider.disconnect();
      provider = null;
      web3._isConnected = false;
      console.log("web3 connection error ", err);
      console.log("will try to reconnect");
      lastConnectTimer = setTimeout(() => {
        keepWeb3Alive();
      }, 1000);
    }
  });
  provider.on("end", function(err) {
    if ( dataprocessing ) {
      return
    }
    //debugger
    if (!lastConnectTimer) {
      if (provider && !provider.___disconnected) {
        provider.___disconnected = true;
        try {
          provider.disconnect();
        } catch (e) {}
        provider = null;
        web3._isConnected = false;
        console.log("web3 connection error ", err);
        console.log("will try to reconnect");
        lastConnectTimer = setTimeout(() => {
          keepWeb3Alive();
        }, 10000);
      }
    }
  });
  web3 = new Web3(provider);
  web3._isConnected = false;
  web3 = web3FusionExtend.extend(web3);
  web3.fsn.enableBigIntJSONParse()
}

// startup our web3 connection
//
keepWeb3Alive();


async function checkReceipt() {
    if (!web3._isConnected) {
        console.log("web3 connection down will retry");
        scheduleNewScan(2000);
        return;
    }

    if ( index === transToCheck.length ) {
        console.log("done") 

        console.log("The total amount was transfered -> " + total.toFixed() )

        // getting balance from each block
        let blocksList = Object.keys(blocks)

        for ( let block of blocksList ) {
            let balances = await web3.fsn.getAllTimeLockBalances( "0xc98f8c6b319ecceccaa9361ed5372274674f96cf", block )
            console.log( "block", block, "balance", JSON.stringify(balances))
        }
        return
    }


    console.log("===========================================================")
    let receipt = await web3.eth.getTransactionReceipt( transToCheck[index] )
    console.log( receipt.status + ", " +  transToCheck[index] + ", " + receipt.blockNumber )
    let tran = await web3.eth.getTransaction(transToCheck[index])

    blocks[receipt.blockNumber] = "true"

    console.log("")
    console.log( "transaction", transToCheck[index])
    console.log( JSON.stringify(tran ) )
    console.log("")
    console.log( "receipt", transToCheck[index])
    console.log( JSON.stringify( receipt ) )
   
    if (receipt.logs.length) {
        let jsonLogData, saveData
        try {
            saveData = web3.fsn.hex2a(receipt.logs[0].data);
            let val = saveData.indexOf("Value")
          let valStr = saveData.substr( val + 5 + 2 )
          valStr = valStr.replace( "}" , "" )
          jsonLogData = JSON.parse(saveData);

          let valExtra = new BigNumber( valStr )

          total = total.add( valExtra )  

          console.log(saveData)

        } catch (e) {
            console.log(e)
          logData = null;
          saveData = null;
        }
    }
  
    index++
    scheduleNewScan(10);
}

/**
 *
 * @param {schedule a new call for next block, if timeset use this value else default to 500ms } timeToSet
 */
function scheduleNewScan(timeToSet) {
    inHere = false;
    if (!timerSet) {
      timerSet = setTimeout(() => {
        timerSet = null;
        checkReceipt();
      }, timeToSet || 500);
    }
  }
  