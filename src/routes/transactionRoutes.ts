import express from "express";
import Transaction from "../controllers/TransactionController";
import { auth } from "../middlewares/authMiddleware";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const transactionController = new Transaction();

router.post("/", auth("CUSTOMER"),transactionController.createTransaction);
router.patch("/:transactionId/reject", auth("ORGANIZER"), transactionController.rejectTransaction);
router.patch("/:transactionId/accept", auth("ORGANIZER"), transactionController.acceptTransaction);
router.patch("/:transactionId/upload",upload.single('proofImage'), auth(), transactionController.uploadProof);

export default router;