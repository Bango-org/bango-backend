import { EventStatus, Prisma, Event, Outcome } from '@prisma/client';
import prisma from '../client';

/**
 * Create a Outcome
 * @param {Object} outcomeBody
 * @returns {Promise<Outcome>}
 */
const createOutcome = async (
  outcome_title: string,
  eventID: number
): Promise<Outcome> => {
    return prisma.outcome.create({
        data: {
           outcome_title, 
           eventID
        }
    });
};

/**
 * Query for Outcome
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOutcome = async <Key extends keyof Outcome>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    keys: Key[] = [
        'id',
        'outcome_title',
        'current_supply',
        'total_liquidity',
        'eventID',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Outcome, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const events = await prisma.outcome.findMany({
        where: filter,
        select: {
            ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
            _count: {
                select: {
                    tokenAllocations: true
                }
            }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy.split(":")[0]]: sortBy.split(":")[1] } : undefined
    });
    return events as unknown as Pick<Outcome, Key>[];
};

/**
 * Get outcome by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Event, Key> | null>}
 */
const getOutcomeById = async <Key extends keyof Event>(
    id: number,
    keys: Key[] = [
        'id',
        'outcome_title',
        'current_supply',
        'total_liquidity',
        'eventID',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Event, Key> | null> => {
    return prisma.outcome.findUnique({
        where: { id },
        select: {
            ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
            event: {
                select: {
                    id: true, 
                    unique_id: true,
                    question: true,
                    expiry_date: true
                }
            }
        },
    }) as Promise<Pick<Event, Key> | null>;
};


export default {
    createOutcome,
    queryOutcome,
    getOutcomeById
};
