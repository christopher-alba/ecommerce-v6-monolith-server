import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: 1 })
  userId: string;

  @Prop({ required: false, unique: true, index: 1 })
  email: string;

  @Prop({ required: true, unique: false, index: 1 })
  firstName: string;

  @Prop({ required: true, unique: false, index: 1 })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
