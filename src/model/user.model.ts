import { prop, ReturnModelType, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { CompanyModel } from './company.model';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class UserModel {
  @prop({ required: true, index: true, unique: true })
  email!: string;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName?: string;

  @prop({ required: true })
  password?: string;

  @prop({ ref: CompanyModel })
  company?: Ref<CompanyModel>;

  public static findEmail(this: ReturnModelType<typeof UserModel>, email: string): Promise<any> {
    return this.findOne({ email }).exec();
  }
}

export const instanceUserModel = getModelForClass(UserModel);
