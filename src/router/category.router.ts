import { Router, Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import CategoryModel from '../model/category.model';

export default class CategoryRouter {
  public path = '/category';
  public requiredAuth = false;
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/:id`, this.getCategoryById);
    this.router.get(`/`, this.getAllCategories);
    this.router.post('/', this.createCategory);
    this.router.put('/', this.modifyCategory);
  }

  getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await CategoryModel.find());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const category = await CategoryModel.findOne({ _id: new ObjectId(id) });
      if (category) {
        return res.status(200).json(category);
      } else {
        return res.status(404).json({ error: 'registro no existe' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  createCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const categoryCreated = await CategoryModel.create(req.body);
      return res.status(200).json(categoryCreated);
    } catch (error) {
      return res.status(500).json({ error: 'ha ocurrido un error' });
    }
  };

  modifyCategory = async (req: Request, res: Response): Promise<Response> => {
    try {
      const currentcategory = req.body;
      delete currentcategory.createdAt;
      delete currentcategory.updatedAt;
      delete currentcategory.__v;
      const currentDoc = await CategoryModel.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, req.body, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
}
