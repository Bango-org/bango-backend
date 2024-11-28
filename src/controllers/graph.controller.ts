import pick from '../utils/pick';
import catchAsync from '../utils/catchAsync';
import prisma from '../client';

const getEventGraph = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['eventID', 'startDate', 'endDate']);

    let outcomesPriceData = [];

    if (filter.startDate === null || filter.startDate === undefined) {
        outcomesPriceData = await prisma.trade.findMany({
            where: {
                eventID: filter.eventID as number,
            },
            select: {
                createdAt: true,
                price: true
            }
        })
    }

    else {

        outcomesPriceData = await prisma.trade.findMany({
            where: {
                eventID: filter.eventID as number,
                createdAt: {
                    gte: new Date(filter.startDate as string),
                    lte: new Date(filter.endDate as string)
                }
            },
            select: {
                createdAt: true,
                price: true
            }
        })
    }



    res.send(outcomesPriceData);
});


export default {
    getEventGraph,
};
