import { Router } from 'express';

export default abstract class RouterApp {
  public path = '';
  public requiredAuth = false;
  public router = Router();

  abstract initialModels(): void;

  abstract initializeRoutes(): void;
}
