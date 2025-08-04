import { Request, Response } from "express";
import AttendeeService from "../services/attendeeService"
import { asyncHandler } from "../helpers/asyncHandler";

class AttendeeController {
    public getListAttendee = asyncHandler(async (req: Request, res: Response) => {
        const data = await AttendeeService.getListAttendee();
        res.json(data);
    })
}

export default new AttendeeController();