import { Router, Request, Response } from 'express';
import TestModel from '../model/test.model';

export default class UserRouter {
  public path = '/test';
  public requiredAuth = false;
  public router = Router();
  private userModel: any;

  constructor() {
    this.initialModels();
    this.initializeRoutes();
  }

  private initialModels() {
    this.userModel = new TestModel().getModelForClass( TestModel, {
      schemaOptions: { collection: 'test' }
    })
  }

  public initializeRoutes() {
    this.router.get(`/`, this.getUsers);
  }

  getUsers = async ( req: Request, res: Response ) => {
    try {
      return res.status(200).json({});
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}