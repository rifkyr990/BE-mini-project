import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { auth } from "../middlewares/authMiddleware";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

class AuthRouter {
    private router: Router;
    private controller: AuthController;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Public routes
        this.router.post("/register", this.controller.register);
        this.router.post("/login", this.controller.login);
        this.router.get("/verify-email", this.controller.verifyEmail);
        this.router.post("/forgot-password", this.controller.forgotPassword);
        this.router.post("/reset-password", this.controller.resetPassword);

        // Protected routes (require authentication)
        this.router.get("/profile", auth(), this.controller.getProfile);
        this.router.put(
            "/profile",
            auth(),
            upload.single('profileImage'),
            this.controller.updateProfile
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default AuthRouter;
