import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'category' } })
export class CategoryModel extends TimeStamps {
  @prop({ required: true, index: true })
  name?: string;
}

export default getModelForClass(CategoryModel);
