import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import eventRoute from './event.route';
import threadRoute from './thread.route';
import blobRoute from './blob.route';
import outcomeRoute from './outcome.route';
import tokenAllocationRoute from './token-allocation.route';
import tradeRoute from './trade.route';
import graphRoute from './graph.route';

import config from '../../config/config';
import path from 'path';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/events',
    route: eventRoute
  },
  {
    path: "/threads",
    route: threadRoute
  },
  {
    path: "/upload",
    route: blobRoute
  },
  {
    path: "/outcomes",
    route: outcomeRoute
  },
  {
    path: "/token-allocations",
    route: tokenAllocationRoute
  },
  {
    path: "/trades",
    route: tradeRoute
  },
  {
    path: "/graph",
    route: graphRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
