import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import config from "../config/config";
import * as bip from 'bip322-js';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { authenticatedBitcoind, sendToAddress } from 'bitcoin-cli-ts'
import env from "../config/config";

const bitcoind = authenticatedBitcoind({
    protocol: 'http',
    host: config.bitcoin.host,
    username: config.bitcoin.user,
    password: config.bitcoin.password,
    timeout: 30000,
    port: parseInt(config.bitcoin.port, 10),
    walletName: "testwallet", // optional,
})



const fetchBitcoinprice = catchAsync(async (req, res) => {
    const { walletAddress, signature } = req.body;

    const btcUsd = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC&convert=USD`, {
        method: "GET",
        headers: {
            'Accepts': 'application/json',
            "X-CMC_PRO_API_KEY": env.coin_market_cap_api
        }
    })

    const jsn = await btcUsd.json();
    const btcPrice = jsn.data.BTC[0].quote.USD.price

    res.status(StatusCodes.OK).send({price: btcPrice});
});


const sendBitcoin = catchAsync(async (req, res) => {
    const { walletAddress, signature } = req.body;

    const isValid = bip.Verifier.verifySignature(walletAddress, config.signature_message, signature)

    if (!isValid) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Signature');
    }


    let usr = prisma.user.findFirst({
        where: {
            wallet_address: walletAddress
        }
    });

    if (!usr) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User Not Found');
    }


    const resp = await sendToAddress({
        bitcoind, 
        address: walletAddress, 
        amount: 0.00013,
        estimate_mode: "ECONOMICAL",
        replaceable: false,
        subtractfeefromamount: false,
        conf_target: 1
    })

    res.status(StatusCodes.CREATED).send({txid: resp});
});


export default {
    sendBitcoin,
    fetchBitcoinprice
};
