import { Router } from "express";
import { authMiddleware } from "../middlware";
import userController from "../controller/user.controller";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

const router = Router();

router.get("/me", authMiddleware, userController.getUser);
router.post("/profile", authMiddleware, upload.single('file') as any, userController.editUser);
export const userRouter = router;
