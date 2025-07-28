import { Request, Response } from 'express';
import UserService from '../services/userService';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (_: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    res.json(users);
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, name } = req.body;
    const newUser = await this.userService.createUser(email, name);
    res.status(201).json(newUser);
  };
}

export default UserController;
