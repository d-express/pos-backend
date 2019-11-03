import { Typegoose, prop } from 'typegoose';

export default class ProductModel extends Typegoose {
  @prop({ required: true, index: true })
  name?: string;

  @prop({ required: true })
  description?: string;

  @prop({ required: true })
  price?: number;

  @prop({ required: true })
  type?: string;
}
