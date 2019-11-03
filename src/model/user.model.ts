import { Typegoose, prop } from 'typegoose';

export default class UserModel extends Typegoose {
  @prop({ required: true, index: true })
  email!: string;

  @prop({ required: true })
  firstName!: string;

  @prop({ required: true })
  lastName?: string;

  @prop({ required: true })
  password?: string;
}
