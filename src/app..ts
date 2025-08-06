import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRouter from '../src/routes/auth.route';
import TransactionRouter from '../src/routes/transaction.route';
import EventRouter from '../src/routes/event.route';
import DashboardRouter from '../src/routes/dashboard.route';
import AttendeeRouter from '../src/routes/attendee.route';

dotenv.config();

class App {
  public app: Application;
  private authRouter: AuthRouter;
  private transactionRouter: TransactionRouter;
  private eventRouter: EventRouter;
  private dashboardRouter: DashboardRouter;
  private attendeeRouter: AttendeeRouter;

  constructor() {
    this.app = express();

    this.authRouter = new AuthRouter();
    this.transactionRouter = new TransactionRouter();
    this.eventRouter = new EventRouter();
    this.dashboardRouter = new DashboardRouter();
    this.attendeeRouter = new AttendeeRouter();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    }));

    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use("/api/auth", this.authRouter.getRouter());
    this.app.use("/api/transactions", this.transactionRouter.getRouter());
    this.app.use("/api/events", this.eventRouter.getRouter());
    this.app.use("/api/dashboard", this.dashboardRouter.getRouter());
    this.app.use("/api/attendees", this.attendeeRouter.getRouter());
  }

  private configureErrorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong', error: err.message || err });
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
