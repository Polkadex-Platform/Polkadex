// IMPORTANT NOTE
// This is a simple tutorial that shows how to retrieve market data from Polkadex nodes in real time
// These data can be used to do technical analysis off-chain and place trades accordingly.
// The given example uses trades from ETH/BTC market of Binance Public API to simulate trades. Binance API was not chosen on
// endorse them but only as an example, It should only be treated as a quick and dirty solution to simulate real trades.
// Polkadex team is not associated with Binance in any way.
// Import
const {ApiPromise, WsProvider, Keyring} = require('@polkadot/api');
// Crypto promise, package used by keyring internally
const {cryptoWaitReady} = require('@polkadot/util-crypto');
const BN = require("bn.js")
// Initialize Binance
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});
const wsProvider = new WsProvider('ws://localhost:9944');
polkadex_market_data().then();
async function polkadex_market_data() {
    // Wait for the promise to resolve, async WASM or `cryptoWaitReady().then(() => { ... })`
    await cryptoWaitReady();
    // Create a keyring instance
    const keyring = new Keyring({type: 'sr25519'});
    // The create new instance of Alice
    const alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
    const api = await ApiPromise.create({
        types: {
            "OrderType": {
                "_enum": [
                    "BidLimit",
                    "BidMarket",
                    "AskLimit",
                    "AskMarket"
                ]
            },
            "Order": {
                "id": "Hash",
                "trading_pair": "Hash",
                "trader": "AccountId",
                "price": "FixedU128",
                "quantity": "FixedU128",
                "order_type": "OrderType"
            },
            "Order4RPC":{
                "id": "[u8;32]",
                "trading_pair": "[u8;32]",
                "trader": "[u8;32]",
                "price": "Vec<u8>",
                "quantity": "Vec<u8>",
                "order_type": "OrderType"
            },
            "MarketData": {
                "low": "FixedU128",
                "high": "FixedU128",
                "volume": "FixedU128",
                "open": "FixedU128",
                "close": "FixedU128"
            },
            "LinkedPriceLevel": {
                "next": "Option<FixedU128>",
                "prev": "Option<FixedU128>",
                "orders": "Vec<Order>"
            },
            "LinkedPriceLevelRpc":{
                "next": "Vec<u8>",
                "prev": "Vec<u8>",
                "orders": "Vec<Order4RPC>"
            },
            "Orderbook": {
                "trading_pair": "Hash",
                "base_asset_id": "u32",
                "quote_asset_id": "u32",
                "best_bid_price": "FixedU128",
                "best_ask_price": "FixedU128"
            },
            "OrderbookRPC":{
                "trading_pair": "[u8;32]",
                "base_asset_id": "u32",
                "quote_asset_id": "u32",
                "best_bid_price": "Vec<u8>",
                "best_ask_price": "Vec<u8>"
            },
            "OrderbookUpdates": {
                "bids": "Vec<FrontendPricelevel>",
                "asks": "Vec<FrontendPricelevel>"
            },
            "FrontendPricelevel": {
                "price": "FixedU128",
                "quantity": "FixedU128"
            },
            "Permissions": {
                "_enum": [
                    "SystemLevel",
                    "FoundationLevel",
                    "UserLevel"
                ]
            },
            "AssetInfo": {
                "total_issuance": "FixedU128",
                "issuer":"AccountId",
                "permissions":"Permissions",
                "existential_deposit": "FixedU128"
            },
            "AssetID": "H256",
            "Judgement": {
                "_enum": [
                    "Reasonable",
                    "KnownGood",
                    "OutOfDate",
                    "PolkadexFoundationAccount",
                    "Default",
                    "Freeze",
                ]
            },
        },
        rpc: {
            polkadex: {
                getAllOrderbook: {
                    description: " Blah",
                    params: [],
                    type: "Vec<OrderbookRpc>"
                },
                getAskLevel: {
                    description: " Blah",
                    params: [
                        {
                            name: "trading_pair",
                            type: "Hash"
                        }
                    ],
                    type: "Vec<FixedU128>"
                },
                getBidLevel: {
                    description: " Blah",
                    params: [
                        {
                            name: "trading_pair",
                            type: "Hash"
                        }
                    ],
                    type: "Vec<FixedU128>"
                },
                getMarketInfo: {
                    description: " Blah",
                    params: [
                        {
                            name: "trading_pair",
                            type: "Hash"
                        },
                        {
                            name: "blocknum",
                            type: "u32"
                        }
                    ],
                    type: "MarketDataRpc"
                },
                getOrderbook: {
                    description: " Blah",
                    params: [
                        {
                            name: "trading_pair",
                            type: "Hash"
                        }
                    ],
                    type: "OrderbookRpc"
                },
                getOrderbookUpdates: {
                    description: "Gets best 10 bids & asks",
                    params: [
                        {
                            name: "at",
                            type: "Hash"
                        },
                        {
                            name: "trading_pair",
                            type: "Hash"
                        }
                    ],
                    type: "OrderbookUpdates"
                },
                getPriceLevel: {
                    description: " Blah",
                    params: [
                        {
                            name: "trading_pair",
                            type: "Hash"
                        }
                    ],
                    type: "Vec<LinkedPriceLevelRpc>"
                },
            }
        },
        provider: wsProvider
    });
    const tradingPairID = ("0xaa5315d47da7df5bb1579821f99a3d261132f292dc44a3e63872984b55f9455f","0x0d055519a22af35714d47c10df796bbbbcc3ad9e58e2406244089e9d8152bdd1");
    const UNIT = new BN(1000000000000,10);
    const total_issuance = UNIT.mul(UNIT);
    let options = {
        permissions: {
            update: null,
            mint: null,
            burn: null
        }
    }
    // Create first token - Say USDT
await api.tx.polkadex.registerNewOrderbookWithPolkadex("0xaa5315d47da7df5bb1579821f99a3d261132f292dc44a3e63872984b55f9455f", 1).signAndSend(alice, {nonce: 2});
await api.tx.polkadex.registerNewOrderbookWithPolkadex("0x0d055519a22af35714d47c10df796bbbbcc3ad9e58e2406244089e9d8152bdd1", 1).signAndSend(alice, {nonce: 3});
await api.tx.polkadex.registerNewOrderbook("0xaa5315d47da7df5bb1579821f99a3d261132f292dc44a3e63872984b55f9455f", 1, "0x0d055519a22af35714d47c10df796bbbbcc3ad9e58e2406244089e9d8152bdd1", 1).signAndSend(alice, {nonce: 4});

    // Let's simulate some traders
//    let alice_nonce = 5;
//
//    binance.websockets.trades(['BTCUSDT'], (trades) => {
//        let {e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId} = trades;
//        // console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", BUY: "+maker);
//
//        let price_converted = new BN(cleanString((parseFloat(price) * UNIT).toString()),10);
//        let quantity_converted =new BN(cleanString((parseFloat(quantity) * UNIT).toString()),10);
//        if (maker === true) {
//            api.tx.polkadex.submitOrder("BidLimit", tradingPairID, price_converted, quantity_converted).signAndSend(alice, {nonce: alice_nonce});
//            alice_nonce = alice_nonce + 1;
//        } else {
//            api.tx.polkadex.submitOrder("AskLimit", tradingPairID, price_converted, quantity_converted).signAndSend(alice, {nonce: alice_nonce});
//            alice_nonce = alice_nonce + 1;
//        }
//    });
}

function cleanString(value) {
    let pos = value.indexOf(".");
    if (pos === -1 ){
        return value
    }else{
        return value.substring(0,pos)
    }
}

