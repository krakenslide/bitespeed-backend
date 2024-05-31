import { Router } from "express";
import { identifyController } from "../controller/controller";

const router = Router();
/**
 * @swagger
 * /api/identify:
 *   post:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post("/identify", identifyController);

export default router;
