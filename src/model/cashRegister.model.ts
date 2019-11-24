import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BranchOfficeModel } from './branchOffice.module';

@modelOptions({ schemaOptions: { collection: 'cash_register' } })
export class CashRegisterModel extends TimeStamps {
  @prop({ required: true, set: (val: string) => val.toLowerCase(), get: (val: string) => val })
  name?: string;

  @prop({ ref: BranchOfficeModel, required: true })
  branchOffice?: Ref<BranchOfficeModel>;
}

export const instanceCashRegisterModel = getModelForClass(CashRegisterModel);
