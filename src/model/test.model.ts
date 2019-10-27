import {Typegoose, prop } from 'typegoose';

export default class TestModel extends Typegoose {

  @prop ({ required: true, index: true })
  firstName!: string;

  @prop ({ index: true })
  secondName?: string;
}