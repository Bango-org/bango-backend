import { EventStatus, Prisma, Event, TokenAllocation } from '@prisma/client';
import prisma from '../client';

/**
 * Create a TokenAllocation
 * @param {Object} tokenAllocationBody
 * @returns {Promise<TokenAllocation>}
 */
const createTokenAllocation = async (
    userId: number,
    outcomeId: number
): Promise<TokenAllocation> => {
    return prisma.tokenAllocation.create({
        data: {
            amount: 0,
            userId,
            outcomeId
        }
    });
};

/**
 * Query for TokenAllocation
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTokenAllocation = async <Key extends keyof TokenAllocation>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    keys: Key[] = [
        'id',
        'amount',
        'userId',
        'outcomeId',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<TokenAllocation, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const events = await prisma.tokenAllocation.findMany({
        where: filter,
        select: {
            ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy.split(":")[0]]: sortBy.split(":")[1] } : undefined
    });
    return events as unknown as Pick<TokenAllocation, Key>[];
};

/**
 * Get token allocation by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<TokenAllocation, Key> | null>}
 */
const getTokenAllocationById = async <Key extends keyof TokenAllocation>(
    id: number,
    keys: Key[] = [
        'id',
        'amount',
        'userId',
        'outcomeId',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<TokenAllocation, Key> | null> => {
    return prisma.tokenAllocation.findUnique({
        where: { id },
        select: {
            ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
            outcome: {
                select: {
                    id: true, 
                    outcome_title: true,
                    current_supply: true,
                    total_liquidity: true,
                    createdAt: true,
                    updatedAt: true
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
    }) as Promise<Pick<TokenAllocation, Key> | null>;
};


export default {
    createTokenAllocation,
    queryTokenAllocation,
    getTokenAllocationById
};
