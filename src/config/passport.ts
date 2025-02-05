import prisma from '../client';
import { Request } from "express";
import { privy } from '../privy';
import { Strategy as CustomStrategy } from "passport-custom";

const jwtVerify = async (req: Request, done: any) => {
  try {
    const authToken = req.headers.authorization;
    
    if (!authToken || !authToken.startsWith("Bearer ")) {
      return done(null, false, { message: "No token provided" })
    }
    
    const verifiedClaims = await privy.verifyAuthToken(authToken!);
    const privyUser = await privy.getUserById(verifiedClaims.userId)
    
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        username: true,
        role: true,
        wallet_address: true
      },
      where: { wallet_address: privyUser.wallet?.address! }
    })
    console.log("=====", privyUser.wallet?.address!)

    console.log(user)
    if (!user) {
      return done(null, false);
    }

    done(null, user);

  } catch (error) {
    done(error, false);
  }
};


export const jwtStrategy = new CustomStrategy(jwtVerify);