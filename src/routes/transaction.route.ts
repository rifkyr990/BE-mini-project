import { Router } from "express";
import TransactionController from "../controllers/TransactionController";
import { auth } from "../middlewares/authMiddleware";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

class TransactionRouter {
    private router: Router;
    private controller: TransactionController;

    constructor() {
        this.router = Router();
        this.controller = new TransactionController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Protected route for ORGANIZER
        this.router.get(
            "/:eventId",
            auth("ORGANIZER"),
            this.controller.getTransactionByEventID
        );

        // Protected route for CUSTOMER
        this.router.post(
            "/",
            auth("CUSTOMER"),
            this.controller.createTransaction
        );

        // ORGANIZER routes to accept/reject transactions
        this.router.patch(
            "/:transactionId/reject",
            auth("ORGANIZER"),
            this.controller.rejectTransaction
        );

        this.router.patch(
            "/:transactionId/accept",
            auth("ORGANIZER"),
            this.controller.acceptTransaction
        );

        // Upload proof (auth middleware without role specified = any authenticated user)
        this.router.patch(
            "/:transactionId/upload",
            upload.single('proofImage'),
            auth(),
            this.controller.uploadProof
        );
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default TransactionRouter;
