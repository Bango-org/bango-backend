import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import { amm } from '../amm';


const buyTrade = catchAsync(async (req, res) => {

    const { eventId, outcomeId, usdtAmount } = req.body;

    let usr: any = req.user;
    const buyResult = await amm.buyShares(eventId, outcomeId, usdtAmount, usr.id);
    res.status(StatusCodes.CREATED).send(buyResult);

});

const sellTrade = catchAsync(async (req, res) => {
    const { eventId, outcomeId, usdtAmount } = req.body;
    
    let usr: any = req.user;
    const sellResult = await amm.sellShares(eventId, outcomeId, usdtAmount, usr.id);
    res.status(StatusCodes.CREATED).send(sellResult);

});

const getOutcomePrices = catchAsync(async (req, res) => {
    let prices =  await amm.getPrices(req.params.evnetId)
    res.status(StatusCodes.OK).send(prices);
});


export default {
    buyTrade,
    sellTrade,
    getOutcomePrices
};
