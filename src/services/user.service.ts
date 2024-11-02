import { User, Role, Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
// const createUser = async (
//   email: string,
//   password: string,
//   wallet_address: string,
//   name?: string,
//   role: Role = Role.USER
// ): Promise<User> => {
//   if (await getUserByEmail(email)) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already taken');
//   }
//   return prisma.user.create({
//     data: {
//       email,
//       name,
//       wallet_address,
//       password: await encryptPassword(password),
//       role
//     }
//   });
// };

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'username',
    'about',
    'wallet_address',
    'profile_pic',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: (page - 1) * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<User, Key>[];
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: number,
  keys: Key[] = [
    'id',
    'username',
    'about',
    'wallet_address',
    'profile_pic',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByAddress = async <Key extends keyof User>(
  wallet_address: string,
  keys: Key[] = [
    'id',
    'username',
    'about',
    'wallet_address',
    'profile_pic',
    'events',
    'trades',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { wallet_address },
    select: {
      ...keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    }
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByWalletAddress = async <Key extends keyof User>(
  wallet_address: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'about', 'profile_pic'] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await getUserByAddress(wallet_address);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
};

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId: number): Promise<User> => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }
//   await prisma.user.delete({ where: { id: user.id } });
//   return user;
// };

export default {
  // createUser,
  queryUsers,
  getUserById,
  getUserByAddress,
  updateUserByWalletAddress,
  // deleteUserById
};
