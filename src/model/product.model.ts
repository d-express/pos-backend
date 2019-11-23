import { prop, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Ref, ModelType } from '@typegoose/typegoose/lib/types';
import { CategoryModel } from './category.model';
import { PriceModel } from './price.model';
import { ObjectId } from 'bson';

class ImageModel {
  @prop({})
  public contentType?: string;

  @prop({})
  public image?: string;
}
@modelOptions({ schemaOptions: { collection: 'products' } })
class ProductModel extends TimeStamps {
  @prop({ required: true, index: true })
  name?: string;

  @prop({ required: true })
  description?: string;

  @arrayProp({ itemsRef: PriceModel })
  prices?: Ref<PriceModel>[];

  @prop({ required: true })
  type?: string;

  @prop({ required: true, index: true })
  sku?: string;

  @prop({ required: false })
  photo?: string;

  @arrayProp({ items: String, index: true })
  tags?: string[];

  @prop({ ref: CategoryModel })
  category?: Ref<CategoryModel>;

  @prop({ required: true })
  manageExistence?: boolean;

  @prop({ required: true })
  tax?: number;

  @prop({ _id: false })
  public image!: ImageModel;

  static async getItems(this: ModelType<ProductModel>): Promise<any> {
    return this.aggregate([
      {
        $lookup: {
          from: 'category',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryName',
        },
      },
      {
        $unwind: '$categoryName',
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'prices',
          foreignField: '_id',
          as: 'pricesList',
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
          name: 1,
          description: 1,
          price: 1,
          type: 1,
          sku: 1,
          manageExistence: 1,
          tax: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          categoryId: '$categoryName._id',
          category: '$categoryName.name',
          prices: '$pricesList',
        },
      },
    ]).exec();
  }

  static async getProductById(this: ModelType<ProductModel>, idProduct: string): Promise<any> {
    return this.aggregate([
      {
        $match: {
          _id: new ObjectId(idProduct),
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryName',
        },
      },
      {
        $unwind: '$categoryName',
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'prices',
          foreignField: '_id',
          as: 'pricesList',
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
          name: 1,
          description: 1,
          price: 1,
          type: 1,
          sku: 1,
          manageExistence: 1,
          tax: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          category: '$categoryName.name',
          prices: '$pricesList',
        },
      },
    ]).exec();
  }

  static async getProductByCategory(this: ModelType<ProductModel>, idCategory: string): Promise<any> {
    return this.aggregate([
      {
        $match: {
          category: new ObjectId(idCategory),
        },
      },
      {
        $lookup: {
          from: 'category',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryName',
        },
      },
      {
        $unwind: '$categoryName',
      },
      {
        $lookup: {
          from: 'prices',
          localField: 'prices',
          foreignField: '_id',
          as: 'pricesList',
        },
      },
      {
        $project: {
          _id: 1,
          tags: 1,
          name: 1,
          description: 1,
          price: 1,
          type: 1,
          sku: 1,
          manageExistence: 1,
          tax: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          category: '$categoryName.name',
          prices: '$pricesList',
        },
      },
    ]).exec();
  }
}

export const instanceProductModel = getModelForClass(ProductModel);
