import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'companies' } })
export class CompanyModel extends TimeStamps {
  @prop({ required: true, index: true, unique: true })
  vat!: string;

  @prop({ required: true })
  businessName?: string;

  @prop({ required: true })
  address?: string;

  @prop({ required: true })
  telephone?: string;
}

export const instanceCompanyModel = getModelForClass(CompanyModel);
