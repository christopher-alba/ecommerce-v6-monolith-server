import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Permission {
  ADMIN = 'ADMIN',
  READ = 'READ',
  READWRITE = 'READWRITE',
  NONE = 'NONE',
}

@Schema({ timestamps: true })
export class AdminUser extends Document {
  @Prop({ required: true, unique: true, index: 1 })
  userId: string;

  @Prop({ required: true, unique: true, index: 1 })
  email: string;

  @Prop({ required: true, unique: false, index: 1 })
  firstName: string;

  @Prop({ required: true, unique: false, index: 1 })
  lastName: string;

  @Prop({ required: true, default: Permission.NONE, index: 1 })
  permission: Permission;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
