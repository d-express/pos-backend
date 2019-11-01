import { Router, Request, Response } from 'express';
import UserModel from '../model/user.model';

export default class AuthRouter {
    public path = '/auth';
    public requiredAuth = false;
    public router = Router();
    private userModel: any;

    constructor() {
        this.initialModels();
        this.initializeRoutes();
    }

    private initialModels() {
        this.userModel = new UserModel().getModelForClass( UserModel, {
            schemaOptions: { collection: 'users' }
        })
    }

    public initializeRoutes() {
        this.router.post(`/login`, this.login);
    }

    login = async ( req: Request, res: Response ) => {
        try {
            const { userLogin, password } = req.body;
            const user = await this.userModel.findOne({ email: userLogin });
            if(user) {
                return res.status(200).json(user);
            } else {
                return res.status(401).json({error: 'usuario y/o contraseña invalido'});
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}