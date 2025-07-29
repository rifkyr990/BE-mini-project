import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { authenticate, authorize } from "../middlewares/authMiddleware";

const router = Router();
const controller = new AuthController();

router.post("/register", controller.register.bind(controller));
router.post("/login", controller.login.bind(controller));
router.get("/profile", authenticate, controller.getProfile.bind(controller));
router.put("/profile", authenticate, controller.updateProfile.bind(controller));
router.post("/forgot-password", controller.forgotPassword.bind(controller));
router.post("/reset-password", controller.resetPassword.bind(controller));
router.get("/admin", authenticate, authorize("ORGANIZER"), (req, res) => {
    res.send("Organizer only route");
});

export default router;
