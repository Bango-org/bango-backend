import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { eventValidation } from '../../validations';
import { eventController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageEvents'), validate(eventValidation.createEvent), eventController.createEvent)
  .get(validate(eventValidation.getEvents), eventController.getEvents);

router
  .route('/:eventId')
  .get(validate(eventValidation.getEvent), eventController.getEvent)

router
  .route('/close')
  .post(auth("closeEvent"), validate(eventValidation.closeEvent), eventController.closeEvent)


export default router;

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management and retrieval
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a Event
 *     description: All Users can create events.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unique_id
 *               - question
 *               - description
 *               - option_a
 *               - option_b
 *               - resolution_criteria
 *               - image
 *               - expiry_date
 *               - community
 *             properties:
 *               unique_id:
 *                 type: string
 *               question:
 *                 type: string
 *               description:
 *                 type: string
 *               outcomes:
 *                 type: array
 *                 items: 
 *                   type: string
 *               resolution_criteria:
 *                 type: string
 *               image:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date
 *               community:
 *                 type: array
 *                 items: 
 *                   type: string
 *             example:
 *               unique_id: a81bc81b-dead-4e5d-abff-90865d1e13b1
 *               question: will kamla haris win this election
 *               outcomes: ['Kamla Haris', 'Doland Trump', 'Narendra Modi']
 *               resolution_criteria: Resolution will be based on US election results
 *               image: https://linktoimageblob
 *               description: lets see who will win
 *               expiry_date: 2023-10-26T15:30:00Z
 *               community: ['elections', 'kamla', 'USA']
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Events
 *     description: Only users can retrieve all events.
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: number
 *         description: Event ID
 *       - in: query
 *         name: community
 *         schema:
 *           type: string
 *         description: Event Tag
 *       - in: query
 *         name: userID
 *         schema:
 *           type: number
 *         description: user ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["ACTIVE", "EXPIRED", "CLOSED"]
 *         description: event status
 *       - in: query
 *         name: unique_id
 *         schema:
 *           type: string
 *         description: Event UID
 *       - in: query
 *         name: expiry_date
 *         schema:
 *           type: date
 *         description: event expiry date
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: date
 *         description: Events created on date
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
 *                     $ref: '#/components/schemas/Event'
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
 * /events/{id}:
 *   get:
 *     summary: Get a Event
 *     description: Users can view any event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Event'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */



/**
 * @swagger
 * /events/close:
 *   post:
 *     summary: Close an Event
 *     description: Can only be closed by prediction owner.
 *     tags: [Events]
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
 *               - outcomeWonId
 *             properties:
 *               eventId:
 *                 type: number
 *               outcomeWonId:
 *                 type: number
 *             example:
 *               eventId: 3
 *               outcomeWonId: 2
 *     responses:
 *       "204":
 *         description: No Content
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */
