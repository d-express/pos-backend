import { prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { collection: 'customers' } })
export class CustomerModel extends TimeStamps {
  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  documentNumber!: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  firstName!: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  lastName!: string;

  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  email!: string;
}

export const instanceCustomerModel = getModelForClass(CustomerModel);
