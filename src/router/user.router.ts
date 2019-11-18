import { Router, Request, Response } from 'express';

export default class UserRouter {
  public path = '/users';
  public requiredAuth = false;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/`, this.getUsers);
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
