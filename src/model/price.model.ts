import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'prices' } })
export class PriceModel extends TimeStamps {
  @prop({ required: true })
  value!: number;

  @prop({ required: true })
  description?: string;
}

export const instancePriceModel = getModelForClass(PriceModel);
