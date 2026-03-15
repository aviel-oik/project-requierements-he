import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { postNewUser, getUsers } from "../services/adminservice.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware("admin"), postNewUser );
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

export default router;