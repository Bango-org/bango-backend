import { EventStatus, Prisma, Event, Thread } from '@prisma/client';
import prisma from '../client';

/**
 * Create a Thread
 * @param {Object} threadBody
 * @returns {Promise<Thread>}
 */
const createThread = async (
    message: string,
    eventID: number,
    wallet_address: string,
): Promise<Thread> => {

    let usr = await prisma.user.findUnique({
        where: {
            wallet_address: wallet_address
        }
    })

    return prisma.thread.create({
        data: {
            message,
            eventID,
            userID: usr?.id
        }
    });
};

/**
 * Query for Threads
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTreads = async <Key extends keyof Thread>(
    filter: object,
    options: {
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    },
    keys: Key[] = [
        'id',
        'unique_id',
        'message',
        'eventID',
        'userID',
        'createdAt',
    ] as Key[]
): Promise<Pick<Thread, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const threads = await prisma.thread.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });
    return threads as Pick<Thread, Key>[];
};

/**
 * Get Thread by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Event, Key> | null>}
 */
const getThreadById = async <Key extends keyof Thread>(
    id: number,
    keys: Key[] = [
        'id',
        'unique_id',
        'message',
        'eventID',
        'userID',
        'createdAt'
    ] as Key[]
): Promise<Pick<Thread, Key> | null> => {
    return prisma.thread.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Thread, Key> | null>;
};


export default {
    createThread,
    queryTreads,
    getThreadById
};
