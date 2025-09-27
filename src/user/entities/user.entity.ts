import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })

export class User {
  @Prop({ required: true , unique: true})
  name: string;

  @Prop({ required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
