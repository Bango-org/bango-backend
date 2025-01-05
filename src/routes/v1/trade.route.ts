import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { tradeValidation } from '../../validations';
import { tradeController } from '../../controllers';

const router = express.Router();

router
  .route('/buy')
  .post(auth('manageTrades'), validate(tradeValidation.buyTrade), tradeController.buyTrade)

router
  .route('/sell')
  .post(auth('manageTrades'), validate(tradeValidation.sellTrade), tradeController.sellTrade)


router
  .route('/:eventId')
  .get(validate(tradeValidation.getOutcomePrices), tradeController.getOutcomePrices)

router
  .route('/user-outcome-shares/:eventId')
  .get(auth('manageTrades'), validate(tradeValidation.getOutcomeShares), tradeController.getOutcomeShares)

router
  .route('/')
  .get(validate(tradeValidation.getTrades), tradeController.getTrades)


export default router;

/**
 * @swagger
 * tags:
 *   name: Trades
 *   description: Trade management and retrieval
 */

/**
 * @swagger
 * /trades/buy:
 *   post:
 *     summary: Create a Buy Trade against the AMM
 *     description: All Users can create Trade.
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - outcomeId
 *               - usdtAmount
 *             properties:
 *               eventId:
 *                 type: number
 *               outcomeId:
 *                 type: number
 *               usdtAmount: 
 *                 type: number
 *             example:
 *               eventId: 1
 *               outcomeId: 1
 *               usdtAmount: 10
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */

/**
 * @swagger
 * /trades/sell:
 *   post:
 *     summary: Create a Sell Trade against the AMM
 *     description: All Users can create Trade.
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - outcomeId
 *               - sharesToSell
 *             properties:
 *               eventId:
 *                 type: number
 *               outcomeId:
 *                 type: number
 *               sharesToSell: 
 *                 type: number
 *             example:
 *               eventId: 1
 *               outcomeId: 1
 *               sharesToSell: 10
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */


/**
 * @swagger
 * /trades/{eventId}:
 *   get:
 *     summary: Get event outcome price information
 *     description: Users can view any Trades
 *     tags: [Trades]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: number
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */



/**
 * @swagger
 * /trades/user-outcome-shares/{eventId}:
 *   get:
 *     summary: Get all user shares in an events
 *     description: Users can view any TradeAllocation
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: number
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /trades:
 *   get:
 *     summary: Query Trades
 *     description: All Users can retrieve trades.
 *     tags: [Trades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: Trade ID
 *       - in: query
 *         name: unique_id
 *         schema:
 *           type: string
 *         description: Trade UID
 *       - in: query
 *         name: order_type
 *         schema:
 *           type: string
 *           enum: ["BUY", "SELL"]
 *         description: Type of order
 *       - in: query
 *         name: order_size
 *         schema:
 *           type: number
 *         description: Size of the order
 *       - in: query
 *         name: eventID
 *         schema:
 *           type: number
 *         description: Event ID
 *       - in: query
 *         name: outcomeId
 *         schema:
 *           type: number
 *         description: Outcome ID
 *       - in: query
 *         name: userID
 *         schema:
 *           type: number
 *         description: User ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering trades
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering trades
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (e.g., name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of trades to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
