import { prop, ReturnModelType, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users' } })
export default class UserModel {
  @prop({ required: true, index: true })
  email!: string;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName?: string;

  @prop({ required: true })
  password?: string;

  public static findEmail(this: ReturnModelType<typeof UserModel>, email: string): Promise<any> {
    // this is an Instance Method
    return this.findOne({ email }).exec(); // thanks to "ReturnModelType" "this" has type infomation
  }
}
