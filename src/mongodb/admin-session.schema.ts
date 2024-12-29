import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSessionSchema } from './base-session.schema';
import bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class AdminSession extends Document {
  token: string;
  async verifyToken(plainToken: string): Promise<boolean> {
    return bcrypt.compare(plainToken, this.token);
  }
}

export const AdminSessionSchema = SchemaFactory.createForClass(AdminSession);

// Attach the BaseSessionSchema
AdminSessionSchema.add(BaseSessionSchema);
