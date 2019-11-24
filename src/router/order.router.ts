import { instanceOrderModel } from './../model/order.model';
import { Router, Request, Response } from 'express';
import RouterApp from './router.app';
import { instanceCustomerModel } from '../model/customer.model';

export default class OrderRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/order';
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post(`/`, this.createOrder);
  }

  createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { customerNumber } = req.body;
      delete req.body.customerNumber;
      const currentCustomer = await instanceCustomerModel.findOne({ documentNumber: customerNumber });
      if (!currentCustomer) {
        return res.status(400).json({ error: `Cliente no existe!!` });
      }
      const order = req.body;
      order.customer = currentCustomer._id;
      const orderDb = await instanceOrderModel.create(order);
      return res.status(200).json(orderDb);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
