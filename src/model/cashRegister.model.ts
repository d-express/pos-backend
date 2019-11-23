import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BranchOfficeModel } from './branchOffice.module';

@modelOptions({ schemaOptions: { collection: 'cash_register' } })
export class CashRegisterModel extends TimeStamps {
  @prop({ required: true, index: true })
  name?: string;

  @prop({ ref: BranchOfficeModel })
  branchOffices?: Ref<BranchOfficeModel>;
}

export const instanceCashRegisterModel = getModelForClass(CashRegisterModel);
