import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { outcomeValidation } from '../../validations';
import { outcomeController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .get(validate(outcomeValidation.getOutcomes), outcomeController.getOutcomes);

router
  .route('/:outcomeId')
  .get(validate(outcomeValidation.getOutcome), outcomeController.getOutcome)

export default router;

/**
 * @swagger
 * tags:
 *   name: Outcomes
 *   description: Outcome management and retrieval
 */

/**
 * @swagger
 * /outcomes:
 *   get:
 *     summary: Get all Outcomes
 *     description: Anyone can retrive outcomes.
 *     tags: [Outcomes]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: Outcome ID
 *       - in: query
 *         name: outcome_title
 *         schema:
 *           type: string
 *       - in: query
 *         name: current_supply
 *         schema:
 *           type: number
 *       - in: query
 *         name: eventID
 *         schema:
 *           type: number
 *       - in: query
 *         name: total_liquidity
 *         schema:
 *           type: number
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: date
 *         description: Outcome created on date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Outcome'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /outcomes/{id}:
 *   get:
 *     summary: Get a Outcome
 *     description: Anyone can retrieve outcome detail
 *     tags: [Outcomes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Outcome id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Outcome'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
