import { instancePriceModel } from './../model/price.model';
import { Router, Request, Response } from 'express';
import { instanceProductModel } from '../model/product.model';
import { ObjectId } from 'mongodb';
import RouterApp from './router.app';

export default class ProductRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/products';
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/search`, this.searchProducts);
    this.router.get(`/image/:id`, this.getImageProduct);
    this.router.get(`/:id`, this.getProductById);
    this.router.get(`/`, this.getAllProducts);
    this.router.get(`/category/:id`, this.getAllProductsByCategory);
    this.router.post('/', this.createProducts);
    this.router.post('/:id/price', this.addPriceToProduct);
    this.router.put('/price/:id', this.modifyPriceToProduct);
    this.router.put('/', this.modifyProduct);
  }

  getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await instanceProductModel.getItems());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const product = await instanceProductModel.getProductById(id);
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

  getAllProductsByCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const product = await instanceProductModel.getProductByCategory(id);
      if (product && product.length >= 1) {
        return res.status(200).json(product);
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
      const currentDoc = await instanceProductModel.find({
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
      const priceProduct = await instanceProductModel.create(price);
      product.prices.push(priceProduct._id);
      const productCreated = await instanceProductModel.create(product);
      return res.status(200).json(productCreated);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  getImageProduct = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const document = await instanceProductModel.findById(id);
      if (!document) {
        res.status(404).send({
          message: 'No se encontró ningún evento con ese código',
        });
        return;
      }
      const img = Buffer.from(document.image!.image!, 'base64');
      res.writeHead(200, {
        'Content-Type': document.image!.contentType,
        'Content-Length': img.length,
      });
      res.end(img);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Hubo un error al mometo de devolver el PDF',
        error: error,
      });
      return;
    }
  };

  addPriceToProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const productId = req.params.id;
      const currentProduct = await instanceProductModel.findById(new ObjectId(productId));
      if (!currentProduct) {
        return res.status(404).json({ message: 'Objeto no encontrado' });
      }
      const productPrices = currentProduct.prices;
      if (productPrices) {
        const price = await instancePriceModel.create(req.body);
        productPrices.push(price._id);
        const productUpdated = await instanceProductModel.findOneAndUpdate(
          { _id: new ObjectId(productId) },
          currentProduct,
          {
            new: true,
          },
        );
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
      const currentDoc = await instanceProductModel.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, req.body, {
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
      const currentDoc = await instanceProductModel.findOneAndUpdate({ _id: new ObjectId(currentPrice) }, price, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
