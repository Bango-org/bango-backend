import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import config from "../config/config";
import * as bip from 'bip322-js';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { authenticatedBitcoind, sendToAddress } from 'bitcoin-cli-ts'

const bitcoind = authenticatedBitcoind({
    protocol: 'http',
    host: config.bitcoin.host,
    username: config.bitcoin.user,
    password: config.bitcoin.password,
    timeout: 30000,
    port: parseInt(config.bitcoin.port, 10),
    walletName: "testwallet", // optional,
})




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
    sendBitcoin
};
