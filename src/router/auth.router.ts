import { Request, Response } from 'express';
import { instanceUserModel } from '../model/user.model';
import { instanceCompanyModel } from '../model/company.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ConfigurationApp from '../config/config';
import RouterApp from './router.app';

export default class AuthRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/auth';
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`/login`, this.login);
    this.router.post(`/register`, this.register);
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { userLogin, password } = req.body;
      const user = await instanceUserModel.findEmail(userLogin);
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign(
            {
              id: user._id,
              user: user.userName,
              admin: true,
            },
            ConfigurationApp.seed,
            { expiresIn: ConfigurationApp.tokenExpire },
          );
          return res.status(200).json({
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
            auth: {
              token,
              type: 'Bearer',
            },
          });
        } else {
          return res.status(401).json({ error: 'usuario y/o contraseña invalido' });
        }
      } else {
        return res.status(401).json({ error: 'usuario y/o contraseña invalido' });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      /*const { vat, businessName, address, telephone } = req.body;
      const { email, firstName, lastName, password } = req.body;
      const userExist = await instanceCompanyModel.findOne({ email });*/
      return res.status(200).json({ error: 'usuario y/o contraseña invalido' });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
