import { Router } from "express";
import AuthController from "../controllers/AuthController";
import authMiddleware from "../middlewares/authMiddleware";
import { validateResetToken } from "../middlewares/validateResetToken";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);
router.put('/profile', upload.single('profileImage'), authMiddleware, authController.updateProfile);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", validateResetToken, authController.resetPassword);

export default router;
