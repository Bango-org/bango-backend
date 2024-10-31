import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { blobValidation } from '../../validations';
import { blobController } from '../../controllers';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

router
  .route('/')
  .post(auth('manageBlobUploads'), validate(blobValidation.createBlob),  upload.single('image'), blobController.createBlob)


export default router;

/**
 * @swagger
 * tags:
 *   name: Blob
 *   description: Upload Images on Azure
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload Image on Container
 *     description: All Users can upload images.
 *     tags: [Blob]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload.
 *               type:
 *                 type: string
 *                 enum: ["users", "threads", "events"]
 *                 description: The type of upload, either users or threads.
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blob'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
