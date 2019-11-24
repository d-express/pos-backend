import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import auth from 'express-jwt';
import mongoose from 'mongoose';
import ConfigurationApp from './config/config';
import http from 'http';
import cColor from 'tracer';
import UserRouter from './router/user.router';
import AuthRouter from './router/auth.router';
import ProductRouter from './router/product.router';
import { NextFunction, ErrorHandleFunction } from 'connect';
import CategoryRouter from './router/category.router';
import CustomerRouter from './router/customer.router';
const logger = cColor.colorConsole({ format: ' {{message}} (en {{file}} : {{line}})' });

export class Server {
  private static _intance: Server;
  public app: express.Application;
  public port: number;
  private httpServer: http.Server;
  public routers = [
    new UserRouter(),
    new AuthRouter(),
    new ProductRouter(),
    new CategoryRouter(),
    new CustomerRouter(),
  ];

  private constructor() {
    this.port = ConfigurationApp.port;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.initializeDb();
    this.initializeMiddlewares();
    this.initializeRouters(this.routers);

    this.app.get('', (req: express.Request, res: express.Response): void => {
      res.status(200).json({ status: true, message: 'Service is running...' });
    });

    this.app.use((err: ErrorHandleFunction, _req: express.Request, res: express.Response, next: NextFunction): void => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).json({ status: false, message: 'Autenticación Necesaria para ejecutar esta acción' });
        return;
      } else {
        console.log(err);
      }
      next();
    });
  }

  private async initializeDb(): Promise<void> {
    try {
      mongoose.Promise = global.Promise;
      await mongoose.connect(ConfigurationApp.database, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      });
      console.log('conexión con bases de datos OK');
    } catch (error) {
      console.log(error);
      console.log('error de conexión con bases de datos');
    }
  }

  public static get instance(): Server {
    return this._intance || (this._intance = new this());
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json({ limit: 1024102420, type: 'application/json' }));
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private initializeRouters(routers: Array<Record<string, any>>): void {
    routers.forEach((controller: any) => {
      if (controller.requiredAuth) {
        this.app.use(controller.path, auth({ secret: ConfigurationApp.seed }), controller.router);
      } else {
        this.app.use(controller.path, controller.router);
      }
    });
  }

  async gracefulShutdown(event: any): Promise<void> {
    logger.debug('Close....', event);
    return mongoose.connection.close();
  }

  start(): void {
    this.httpServer.listen(this.port);
  }
}
export default Server;
