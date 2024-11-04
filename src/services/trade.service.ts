import { Trade } from '@prisma/client';
import prisma from '../client';

/**
 * Query for Trades
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrades = async <Key extends keyof Trade>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    dateFilter: {
        [key: string]: unknown;
    },
    keys: Key[] = [
        'id',
        'unique_id',
        'order_type',
        'order_size',
        'amount',
        'createdAt',
    ] as Key[],
): Promise<Pick<Trade, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';

    let _filter: any = filter;
    const startDate: any = _filter.startDate;
    const endDate: any = _filter.endDate;


    const threads = await prisma.trade.findMany({
        where: {
            ...filter,
            createdAt: {
                gte: dateFilter.startDate as string,
                lte: dateFilter.endDate as string
            }
        },
        select: {
            ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
            event: {
                select: {
                    id: true,
                    unique_id: true,
                    question: true, 
                    expiry_date: true,
                    image: true
                }
            },
            outcome: {
                select: {
                    id: true,
                    outcome_title: true
                }
            },
            user: {
                select: {
                    id: true,
                    username: true,
                    wallet_address: true, 
                    profile_pic: true
                }
            }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy.split(":")[0]]: sortBy.split(":")[1] } : undefined
    });
    return threads as unknown as Pick<Trade, Key>[];
};

export default {
    queryTrades
};
