import { ObjectId } from 'bson';
import { instanceCustomerModel } from './../model/customer.model';
import { Request, Response } from 'express';
import RouterApp from './router.app';

export default class CustomerRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/customer';
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/`, this.getCustomers);
    this.router.get(`/:id`, this.getCustomerById);
    this.router.post(`/`, this.createCustomer);
    this.router.put(`/:id`, this.updateCustomer);
  }

  getCustomers = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await instanceCustomerModel.find());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getCustomerById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const idCustomer = req.params.id;
      return res.status(200).json(await instanceCustomerModel.findById(idCustomer));
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  createCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const customerDb = await instanceCustomerModel.create(req.body);
      return res.status(200).json(customerDb);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  updateCustomer = async (req: Request, res: Response): Promise<Response> => {
    try {
      const idCustomer = new ObjectId(req.params.id);
      const { firstName, lastName, email } = req.body;
      const customerDefault = await instanceCustomerModel.findOne({ documentNumber: '0' });
      if (customerDefault) {
        if (customerDefault._id.toString() == idCustomer.toString()) {
          return res.status(400).json({ error: 'Este Cliente no puede ser modificado, accion no permitida' });
        }
      }
      const customerDb = await instanceCustomerModel.updateOne(
        { _id: idCustomer },
        {
          firstName,
          lastName,
          email,
        },
      );
      return res.status(200).json();
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
