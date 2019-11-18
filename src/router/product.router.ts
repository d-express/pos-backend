import PriceModel from './../model/price.model';
import { Router, Request, Response } from 'express';
import ProductModel from '../model/product.model';
import { ObjectId } from 'mongodb';

export default class ProductRouter {
  public path = '/products';
  public requiredAuth = false;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/search`, this.searchProducts);
    this.router.get(`/:id`, this.getProductById);
    this.router.get(`/`, this.getAllProducts);
    this.router.post('/', this.createProducts);
    this.router.post('/:id/price', this.addPriceToProduct);
    this.router.put('/price/:id', this.modifyPriceToProduct);
    this.router.put('/', this.modifyProduct);
  }

  getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await ProductModel.getItems());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const product = await ProductModel.getProductById(id);
      if (product && product.length >= 1) {
        return res.status(200).json(product[0]);
      } else {
        return res.status(404).json({ error: 'registro no existe' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const searchParameter = req.query.q;
      const arrayParameters = searchParameter.split(' ');
      let query: any = `${arrayParameters[0]}`;
      for (let i = 1; i < arrayParameters.length; i++) {
        query += `.*${arrayParameters[i]}`;
      }
      query = new RegExp(query);
      const currentDoc = await ProductModel.find({
        $or: [{ name: { $regex: query } }, { description: { $regex: query, $options: 'i' } }],
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  createProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const product = req.body;
      const price = product.price;
      delete product.price;
      product.prices = [];
      const priceProduct = await PriceModel.create(price);
      product.prices.push(priceProduct._id);
      const productCreated = await ProductModel.create(product);
      return res.status(200).json(productCreated);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  addPriceToProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const productId = req.params.id;
      const currentProduct = await ProductModel.findById(new ObjectId(productId));
      if (!currentProduct) {
        return res.status(404).json({ message: 'Objeto no encontrado' });
      }
      const productPrices = currentProduct.prices;
      if (productPrices) {
        const price = await PriceModel.create(req.body);
        productPrices.push(price._id);
        const productUpdated = await ProductModel.findOneAndUpdate({ _id: new ObjectId(productId) }, currentProduct, {
          new: true,
        });
        return res.status(200).json(productUpdated);
      }
      return res.status(404).json({ message: 'Objeto no encontrado' });
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  modifyProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentProduct = req.body;
      delete currentProduct.createdAt;
      delete currentProduct.updatedAt;
      delete currentProduct.__v;
      const currentDoc = await ProductModel.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, req.body, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  modifyPriceToProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentPrice = req.params.id;
      const price = req.body;
      const currentDoc = await PriceModel.findOneAndUpdate({ _id: new ObjectId(currentPrice) }, price, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
