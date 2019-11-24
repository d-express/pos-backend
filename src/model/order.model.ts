import { prop, modelOptions, getModelForClass, Ref, arrayProp } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { CustomerModel } from './customer.model';
import { PriceModel } from './price.model';

class ProductOrderModel {
  @prop({ ref: PriceModel })
  public price?: Ref<PriceModel>;

  @prop({})
  public quantity?: number;

  @prop({})
  public value?: number;
}

@modelOptions({ schemaOptions: { collection: 'orders' } })
export class OrderModel extends TimeStamps {
  @prop({ ref: CustomerModel, required: true, index: true })
  customer!: Ref<CustomerModel>;

  @arrayProp({ required: true, items: ProductOrderModel })
  products!: ProductOrderModel[];

  @prop({})
  subTotal?: number;

  @prop({})
  taxes?: number;

  @prop({})
  discount?: number;

  @prop({})
  grandTotal?: number;
}

export const instanceOrderModel = getModelForClass(OrderModel);
