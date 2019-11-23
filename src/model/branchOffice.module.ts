import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CompanyModel } from './company.model';

@modelOptions({ schemaOptions: { collection: 'branch_offices' } })
export class BranchOfficeModel extends TimeStamps {
  @prop({ required: true, index: true })
  name?: string;

  @prop({ ref: CompanyModel })
  company?: Ref<CompanyModel>;
}

export const instanceBranchOfficeModel = getModelForClass(BranchOfficeModel);
