import express, { Application } from 'express';
import UserRoutes from '../src/routes/userRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    const userRoutes = new UserRoutes();
    this.app.use('/users', userRoutes.router);
  }
}

export default App;
