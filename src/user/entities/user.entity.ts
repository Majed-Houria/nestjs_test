import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: false,
    versionKey: false,
    transform: (_doc, ret) => {
      return ret;
    },
  },
  toObject: {
    virtuals: false,
    versionKey: false,
    transform: (_doc, ret) => {
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
