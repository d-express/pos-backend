import { Router, Request, Response } from 'express';
import RouterApp from './router.app';

export default class UserRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/users';
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
