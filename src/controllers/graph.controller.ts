import pick from '../utils/pick';
import catchAsync from '../utils/catchAsync';
import prisma from '../client';

const getEventGraph = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['eventID', 'startDate', 'endDate']);

    const outcomes = await prisma.outcome.findMany({
        where: {
            eventID: filter.eventID as number
        },
        select: {
            id: true,
            outcome_title: true
        }
    })

    let outcomesPriceData: any[] = [];


    outcomesPriceData = await Promise.all(outcomes.map(async (outcome) => {
        const outcomePriceData = await prisma.trade.findMany({
            where: {
                eventID: filter.eventID as number,
                outcomeId: outcome.id,
                createdAt: {
                    gte: filter.startDate === null || filter.startDate === undefined ? undefined : new Date(filter.startDate as string),  // Filter for start date
                    lte: filter.endDate === null || filter.endDate === undefined ? undefined : new Date(filter.endDate as string),    // Filter for end date
                }
            },
            select: {
                afterPrice: true,
                createdAt: true,
            }
        });

        let data = {
            outcome: outcome,
            data: outcomePriceData
        }

        return data;
    }));


    res.send(outcomesPriceData);
});


export default {
    getEventGraph,
};
