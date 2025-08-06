import { Request, Response } from "express";
import AttendeeService from "../services/AttendeeService"
import { asyncHandler } from "../helpers/asyncHandler";

class AttendeeController {
    public getListAttendee = asyncHandler(async (req: Request, res: Response) => {
        const data = await AttendeeService.getListAttendee();
        res.json(data);
    })

    public getListAttendeeByID = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await AttendeeService.getListAttendeeByID(id);
        res.json(data);
    })
    
    public markCheckIn = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const attendee = await AttendeeService.checkInAttendee(id);
        
        res.json({ message: 'Check-in successful', attendee })
    })
}

export default new AttendeeController();