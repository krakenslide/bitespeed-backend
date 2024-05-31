import { Router } from "express";
import { identifyController } from "../controller/controller";

const router = Router();

router.post("/identify", identifyController);

export default router;
