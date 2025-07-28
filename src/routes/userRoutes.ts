import { Router } from 'express';
import UserController from '../controllers/userController';

class UserRoutes {
    public router: Router;
    private userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', this.userController.getUsers);
        this.router.post('/', this.userController.createUser);
    }
}

export default UserRoutes;
