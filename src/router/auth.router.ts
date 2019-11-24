import { instanceCashRegisterModel } from './../model/cashRegister.model';
import { instanceBranchOfficeModel } from './../model/branchOffice.module';
import { Request, Response } from 'express';
import { instanceUserModel, UserModel } from '../model/user.model';
import { instanceCompanyModel, CompanyModel } from '../model/company.model';
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
      const { vat, businessName, address, telephone, termsConditions, email, firstName, lastName, password } = req.body;
      const companyExist = await instanceCompanyModel.findOne({ vat });
      const userExist = await instanceUserModel.findOne({ email });
      if (userExist) {
        return res.status(404).json({ error: `El email ${email} ya se encuentra registrado en la plataforma` });
      } else if (companyExist) {
        return res.status(404).json({ error: `El NIT ${vat} ya se encuentra registrado en la plataforma` });
      } else if (!termsConditions) {
        return res.status(404).json({ error: `Debe aceptar Terminos y condiciones` });
      }
      const company: any = {
        vat,
        businessName,
        address,
        telephone,
        termsConditions,
      };
      const companyDb: any = await instanceCompanyModel.create(company);
      const user: any = {
        email,
        firstName,
        lastName,
        password: bcrypt.hashSync(password, 10),
        company: companyDb._id,
      };
      await instanceUserModel.create(user);
      const branchOfficeDb = await instanceBranchOfficeModel.create({
        name: 'Default',
        company: companyDb._id,
      });
      await instanceCashRegisterModel.create({
        name: 'Caja 1',
        branchOffice: branchOfficeDb._id,
      });
      return res.status(200).json({ message: `Registro exitoso` });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
