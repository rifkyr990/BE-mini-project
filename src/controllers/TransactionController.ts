import { asyncHandler } from "../helpers/asyncHandler";
import { Request, Response } from "express";
import streamifier from 'streamifier'

import TransactionService from "../services/TransactionService";

class Transaction {
    public createTransaction = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const transaction = await TransactionService.createTransaction(userId, req.body);

        res.status(201).json({
            message: "Transaction successfull.",
            transaction
        })
    });

    public rejectTransaction = asyncHandler(async (req: Request, res: Response) => {
        const { transactionId } = req.params;
        const result = await TransactionService.rejectTransaction(transactionId);

        res.status(200).json(result);
    });

    public acceptTransaction = asyncHandler(async (req: Request, res: Response) => {
        const { transactionId } = req.params;
        const result = await TransactionService.acceptTransaction(transactionId);

        res.status(200).json(result);
    });

    public uploadProof = asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const userId = req.user!.id;
        const { transactionId } = req.params;

        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        
        let fileStream: NodeJS.ReadableStream | undefined;
        
        if (req.file && req.file.buffer) {
            fileStream = streamifier.createReadStream(req.file.buffer);
        }

        const finalUrl = await TransactionService.uploadTransactionImage(
            userId,
            transactionId,
            fileStream
        );

        res.status(200).json({
            message: "Proof image uploaded to Cloudinary",
            finalUrl
        });
    })
}

export default Transaction;