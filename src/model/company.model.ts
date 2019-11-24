import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'companies' } })
export class CompanyModel extends TimeStamps {
  @prop({
    required: true,
    index: true,
    unique: true,
    set: (val: string) => val.toLowerCase(),
    get: (val: string) => val,
  })
  vat!: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  businessName?: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  address?: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  telephone?: string;

  @prop({ required: true })
  termsConditions!: boolean;
}

export const instanceCompanyModel = getModelForClass(CompanyModel);
