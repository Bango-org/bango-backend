import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { graphValidation } from '../../validations';
import { graphController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .get(validate(graphValidation.getEventGraph), graphController.getEventGraph);


router
  .route('/interval-less')
  .get(validate(graphValidation.getEventGraph), graphController.getEventIntervalLessGraph);


export default router;

/**
 * @swagger
 * tags:
 *   name: Graph
 *   description: Event management and retrieval
 */

/**
 * @swagger
 * /graph:
 *   get:
 *     summary: Get Event Graph Data
 *     description: Get event graph data
 *     tags: [Graph]
 *     parameters:
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
 *         name: eventID
 *         schema:
 *           type: number
 *         description: Event ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['hour', 'day', 'month','year','all']
 *         default: 'hour'
 * 
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */



/**
 * @swagger
 * /graph/interval-less:
 *   get:
 *     summary: Get Event Graph Data
 *     description: Get event graph data
 *     tags: [Graph]
 *     parameters:
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
 *         name: eventID
 *         schema:
 *           type: number
 *         description: Event ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: ['hour', 'day', 'month','year','all']
 *         default: 'hour'
 * 
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
