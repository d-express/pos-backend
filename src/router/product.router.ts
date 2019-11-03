import { Router, Request, Response } from 'express';
import ProductModel from '../model/product.model';
import { ObjectId } from 'mongodb';

export default class ProductRouter {
  public path = '/products';
  public requiredAuth = true;
  public router = Router();
  private productModel: any;

  constructor() {
    this.initialModels();
    this.initializeRoutes();
  }

  private initialModels(): void {
    this.productModel = new ProductModel().getModelForClass(ProductModel, {
      schemaOptions: { collection: 'products' },
    });
  }

  public initializeRoutes(): void {
    this.router.get(`/search`, this.searchProducts);
    this.router.get(`/:id`, this.getProductById);
    this.router.get(`/`, this.getAllProducts);
    this.router.post('/', this.createProducts);
    this.router.put('/', this.modifyProduct);
  }

  getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await this.productModel.find());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const product = await this.productModel.findOne({ _id: new ObjectId(id) });
      if (product) {
        console.log(product);
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
      const currentDoc = await this.productModel.find({
        $or: [{ name: { $regex: query } }, { description: { $regex: query, $options: 'i' } }],
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  createProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const productCreated = await this.productModel.create(req.body);
      return res.status(200).json(productCreated);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  modifyProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentDoc = await this.productModel.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, req.body, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
