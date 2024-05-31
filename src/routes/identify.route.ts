import { Router } from "express";
import { identifyController } from "../controllers/identify.controller";

const router = Router();
/**
 * @swagger
 * /api/identify:
 *   post:
 *     summary: Identify or reconcile a contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contact:
 *                   type: object
 *                   properties:
 *                     primaryContactId:
 *                       type: number
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: string
 *                     phoneNumbers:
 *                       type: array
 *                       items:
 *                         type: string
 *                     secondaryContactIds:
 *                       type: array
 *                       items:
 *                         type: number
 */
router.post("/identify", identifyController);

export default router;
