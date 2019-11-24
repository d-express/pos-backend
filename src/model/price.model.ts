import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'prices' } })
export class PriceModel extends TimeStamps {
  @prop({ required: true })
  value!: number;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  description?: string;
}

export const instancePriceModel = getModelForClass(PriceModel);
