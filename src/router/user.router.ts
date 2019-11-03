import { Router, Request, Response } from 'express';
import UserModel from '../model/user.model';

export default class UserRouter {
  public path = '/users';
  public requiredAuth = true;
  public router = Router();
  private userModel: any;

  constructor() {
    this.initialModels();
    this.initializeRoutes();
  }

  private initialModels(): void {
    this.userModel = new UserModel().getModelForClass(UserModel, {
      schemaOptions: { collection: 'users' },
    });
  }

  public initializeRoutes(): void {
    this.router.get(`/`, this.getUsers);
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(this.userModel.find());
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
