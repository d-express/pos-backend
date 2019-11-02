import { Router, Request, Response } from 'express';
import UserModel from '../model/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ConfigurationApp from '../config/config';

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
                if(bcrypt.compareSync(password, user.password)) {
                    const token = jwt.sign({
                        id: user._id,
                        user: user.userName,
                        admin: true
                    }, ConfigurationApp.seed, { expiresIn: ConfigurationApp.token_expire });
                    return res.status(200).json({
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email
                        },
                        auth: {
                            token,
                            type: 'Bearer'
                        }
                    });
                } else {
                    return res.status(401).json({error: 'usuario y/o contraseña invalido'});
                }
            } else {
                return res.status(401).json({error: 'usuario y/o contraseña invalido'});
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}