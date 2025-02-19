import { StatusCodes } from 'http-status-codes';
import catchAsync from '../utils/catchAsync';
import { authService } from '../services';
import config from "../config/config";
import { generator } from '../utils/username-gen';
import e from 'express';
import { privy } from '../privy';
import prisma from '../client';
import ApiError from '../utils/ApiError';

const register = catchAsync(async (req, res) => {
  const authToken = req.headers.authorization;

  if (authToken === undefined || authToken === null ) {
    throw new ApiError(StatusCodes.UNAUTHORIZED,'Please pass authentication token');
  }

  let privyUser = null
  try {
    const verifiedClaims = await privy.verifyAuthToken(authToken!);
    privyUser = await privy.getUserById(verifiedClaims.userId)
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED,'Invalid Token');
  }

  let user = await prisma.user.findFirst({
    where: { wallet_address:  privyUser.wallet?.address}
  });

  if (user) {
    res.send(user)
    return
  }

  const username = generator.generateWithNumber();

  user = await prisma.user.create({
    data: {
      username:  username,
      about: `Hey I am ${username} and i love Bango`,
      wallet_address: privyUser.wallet?.address! 
    }
  })

  res.send(user);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(StatusCodes.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});


export default {
  register,
  logout,
  refreshTokens,
};
