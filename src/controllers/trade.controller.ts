import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import { amm } from '../amm';
import prisma from '../client';
import { OrderType } from '@prisma/client';
import pick from '../utils/pick';
import { tradeService } from '../services';


const buyTrade = catchAsync(async (req, res) => {

    const { eventId, outcomeId, usdtAmount } = req.body;

    const outcome = await prisma.outcome.findFirst({
        where: {
            id: outcomeId,
            eventID: eventId
        }
    });

    if (outcome === null) {
        res.status(StatusCodes.NOT_FOUND).send("Outcome Not Found")
        return;
    }

    let usr: any = req.user;
    const buyResult = await amm.buyShares(eventId, outcomeId, usdtAmount, usr.id);

    const outcomePriceChange = buyResult.priceImpacts.find(priceImpact => priceImpact.outcomeId === outcomeId);

    await prisma.trade.create({
        data: {
            order_type: OrderType.BUY,
            order_size: buyResult.shares,
            amount: buyResult.cost,
            eventID: eventId,
            outcomeId: outcomeId,
            userID: usr.id, 
            price: outcomePriceChange?.beforePrice
        }
    });

    res.status(StatusCodes.CREATED).send(buyResult);

});

const sellTrade = catchAsync(async (req, res) => {
    const { eventId, outcomeId, sharesToSell } = req.body;

    const outcome = await prisma.outcome.findFirst({
        where: {
            id: outcomeId,
            eventID: eventId
        }
    });

    if (outcome === null) {
        res.status(StatusCodes.NOT_FOUND).send("Outcome Not Found")
        return;
    }
    
    let usr: any = req.user;
    const sellResult = await amm.sellShares(eventId, outcomeId, sharesToSell, usr.id);

    const outcomePriceChange = sellResult.priceImpacts.find(priceImpact => priceImpact.outcomeId === outcomeId);


    await prisma.trade.create({
        data: {
            order_type: OrderType.SELL,
            order_size: sellResult.shares,
            amount: sellResult.cost,
            eventID: eventId,
            outcomeId: outcomeId,
            userID: usr.id, 
            price: outcomePriceChange?.beforePrice
        }
    });

    res.status(StatusCodes.CREATED).send(sellResult);

});


const getTrades = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'unique_id', 'order_type', 'order_size', 'eventID', 'outcomeId', 'userID']);
    const dateFilter = pick(req.query, ['startDate', 'endDate']);

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await tradeService.queryTrades(filter, options, dateFilter);
    
    res.send(result);
});

const getOutcomeShares = catchAsync(async (req, res) => {

    let usr: any = req.user;

    const shares = await prisma.tokenAllocation.findMany({
        where: {
            userId: usr.id,
            outcome: {
                eventID: req.params.eventId
            }
        }
    })

    console.log(shares)

    res.status(StatusCodes.OK).send(shares);
});

const getOutcomePrices = catchAsync(async (req, res) => {
    let prices =  await amm.getPrices(req.params.eventId)
    res.status(StatusCodes.OK).send(prices);
});


export default {
    buyTrade,
    sellTrade,
    getOutcomePrices,
    getOutcomeShares,
    getTrades
};
