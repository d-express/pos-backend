import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class ImageModel {
  @prop({})
  public contentType?: string;

  @prop({})
  public image?: string;
}

@modelOptions({ schemaOptions: { collection: 'category' } })
export class CategoryModel extends TimeStamps {
  @prop({ required: true, index: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  name?: string;

  @prop({ _id: false })
  public image!: ImageModel;
}

export const instanceCategoryModel = getModelForClass(CategoryModel);
