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

export default router;

/**
 * @swagger
 * tags:
 *   name: Trades
 *   description: Trade management and retrieval
 */

/**
 * @swagger
 * /trade/buy:
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
 * /trade/sell:
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
 * /trade/{eventId}:
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
