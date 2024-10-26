import { EventStatus, Prisma, Event } from '@prisma/client';
import prisma from '../client';

/**
 * Create a Event
 * @param {Object} eventBody
 * @returns {Promise<Event>}
 */
const createEvent = async (
    title: string,
    description: string,
    expiry_date: Date,
    community: string[],
    wallet_address: string,
): Promise<Event> => {

    let usr = await prisma.user.findUnique({
        where: {
            wallet_address: wallet_address
        }
    })

    return prisma.event.create({
        data: {
            title,
            description,
            expiry_date,
            community,
            userID: usr?.id!,
            status: EventStatus.ACTIVE
        }
    });
};

/**
 * Query for Event
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEvents = async <Key extends keyof Event>(
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
        'title',
        'expiry_date',
        'userID',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Event, Key>[]> => {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const sortBy = options.sortBy;
    const sortType = options.sortType ?? 'desc';
    const users = await prisma.event.findMany({
        where: filter,
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortType } : undefined
    });
    return users as Pick<Event, Key>[];
};

/**
 * Get event by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<Event, Key> | null>}
 */
const getEventById = async <Key extends keyof Event>(
    id: number,
    keys: Key[] = [
        'id',
        'unique_id',
        'title',
        'expiry_date',
        'userID',
        'community',
        'status',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Event, Key> | null> => {
    return prisma.event.findUnique({
        where: { id },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Event, Key> | null>;
};


export default {
    createEvent,
    queryEvents,
    getEventById
};
