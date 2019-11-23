import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { instanceCategoryModel } from '../model/category.model';
import RouterApp from './router.app';

export default class CategoryRouter extends RouterApp {
  constructor() {
    super();
    this.path = '/category';
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(`/:id`, this.getCategoryById);
    this.router.get(`/image/:id`, this.getImageCategory);
    this.router.get(`/`, this.getAllCategories);
    this.router.post('/', this.createCategory);
    this.router.put('/', this.modifyCategory);
  }

  getAllCategories = async (req: Request, res: Response): Promise<Response> => {
    try {
      return res.status(200).json(await instanceCategoryModel.find());
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id: string = req.params.id;
      const category = await instanceCategoryModel.findOne({ _id: new ObjectId(id) });
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
      const categoryCreated = await instanceCategoryModel.create(req.body);
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
      const currentDoc = await instanceCategoryModel.findOneAndUpdate({ _id: new ObjectId(req.body._id) }, req.body, {
        new: true,
      });
      return res.status(200).json(currentDoc);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  getImageCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const document = await instanceCategoryModel.findById(id);
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
}
