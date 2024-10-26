import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { threadValidation } from '../../validations';
import { threadController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageThreads'), validate(threadValidation.createThread), threadController.createThread)
  .get(validate(threadValidation.getThreads), threadController.getThreads);

router
  .route('/:threadId')
  .get(validate(threadValidation.getThread), threadController.getThread)

export default router;

/**
 * @swagger
 * tags:
 *   name: Threads
 *   description: Thread management and retrieval
 */

/**
 * @swagger
 * /threads:
 *   post:
 *     summary: Create a Thread
 *     description: All Thread can create events.
 *     tags: [Threads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - eventID
 *             properties:
 *               message:
 *                 type: string
 *               eventID:
 *                 type: number
 *             example:
 *               message: I think kamla will loose
 *               eventID: 1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Thread'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Threads
 *     description: Only users can retrieve all Threads.
 *     tags: [Threads]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: Thread ID
 *       - in: query
 *         name: unique_id
 *         schema:
 *           type: string
 *         description: Thread UID
 *       - in: query
 *         name: eventID
 *         schema:
 *           type: number
 *         description: Event UID
 *       - in: query
 *         name: userID
 *         schema:
 *           type: number
 *         description: User Id
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
 *                     $ref: '#/components/schemas/Thread'
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
 * /threads/{id}:
 *   get:
 *     summary: Get a Thread
 *     description: Users can view any Thread
 *     tags: [Threads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Thread id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Thread'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
