import { StatusCodes } from 'http-status-codes';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { threadService } from '../services';
import { TimePeriod, TradeGraphData } from '../types/response';
import { startOfDay, subHours, subDays, subMonths, subYears } from 'date-fns';
import prisma from '../client';

const getGraph = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['id', 'unique_id', 'eventID', 'userID', 'createdAt']);
    const outcomeId = parseInt(req.params.outcomeId);
    const period = (req.query.period as TimePeriod) || '1d';

    const now = new Date();

    // Define the time truncation and interval based on period
    let timeGroup: string;
    let interval: string;
    let startDate = now;

    switch (period) {
        case '1h':
            timeGroup = 'minute';
            interval = '5 minutes';
            startDate = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
            break;
        case '1d':
            timeGroup = 'hour';
            interval = '1 hour';
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
            break;
        case '1m':
            timeGroup = 'day';
            interval = '1 day';
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            break;
        case '1y':
            timeGroup = 'day';
            interval = '1 day';
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
            break;
        case 'all':
            timeGroup = 'day';
            interval = '1 day';
            const firstTrade = await prisma.trade.findFirst({
                where: { outcomeId },
                orderBy: { createdAt: 'asc' },
                select: { createdAt: true }
            });
            startDate = firstTrade?.createdAt || now;
            break;
    }
    // Fetch and aggregate trade data
    const trades = await prisma.$queryRaw<TradeGraphData[]>`
        WITH time_series AS (
        SELECT
            date_trunc(${timeGroup}, dd)::timestamp as timestamp
        FROM generate_series(
            ${startDate}::timestamp,
            ${now}::timestamp,
            ${interval}::interval
        ) dd
        )
        SELECT
        ts.timestamp,
        COALESCE(ROUND(AVG(t.price)), 0) as "avgPrice",
        COALESCE(SUM(t.order_size), 0) as "totalVolume",
        COALESCE(SUM(t.amount), 0) as "totalAmount",
        COALESCE(COUNT(CASE WHEN t.order_type = 'BUY' THEN 1 END), 0) as "buyCount",
        COALESCE(COUNT(CASE WHEN t.order_type = 'SELL' THEN 1 END), 0) as "sellCount",
        COALESCE(COUNT(t.id), 0) as "totalTrades"
        FROM time_series ts
        LEFT JOIN "Trade" t ON 
        date_trunc(${timeGroup}, t."createdAt") = ts.timestamp
        AND t."outcomeId" = ${outcomeId}
        GROUP BY ts.timestamp
        ORDER BY ts.timestamp ASC
  `;





    res.send(trades);
});


export default {
    getGraph,
};
