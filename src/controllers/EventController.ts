import { Request, Response } from 'express';
import { asyncHandler } from '../helpers/asyncHandler';
import EventService from '../services/EventService';
import streamifier from 'streamifier';

class EventController {
    public createEvent = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.id;
        let fileStream: NodeJS.ReadableStream | undefined;
        
        if (req.file && req.file.buffer) {
            fileStream = streamifier.createReadStream(req.file.buffer);
        }

        const event = await EventService.createEvent({ ...req.body, organizerId: userId }, fileStream );

        res.status(201).json({
            message: 'Event created successfully',
            event,
        });
    });

    public getAllEvents = asyncHandler(async (_req: Request, res: Response) => {
        const events = await EventService.findAll();
        res.status(200).json(events);
    });

    public getEventById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const event = await EventService.findById(id);

        if (!event) {
            res.status(404);
            throw new Error('Event not found');
        }

        res.status(200).json(event);
    });

    public getEventsByUser = asyncHandler(async (req: Request, res: Response) => {
        if (req.user?.role !== 'ORGANIZER') {
            return res.status(403).json({ message: "Akses hanya untuk ORGANIZER" });
        }
        const events = await EventService.findByIdUser(req.user.id);
        return res.status(200).json(events);
    });

    public updateEvent = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const event = await EventService.update(id, req.body);

        res.status(200).json({
            message: 'Event updated successfully',
            event,
        });
    });

    public deleteEvent = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        await EventService.delete(id);

        res.status(204).send();
    });
}

export default EventController;
