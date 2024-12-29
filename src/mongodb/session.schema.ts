import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSessionSchema } from './base-session.schema';
import bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class Session extends Document {
  userId: string;
  token: string;
  deviceInfo: any;
  expiresOn: Date;
  async verifyToken(plainToken: string): Promise<boolean> {
    return bcrypt.compare(plainToken, this.token);
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Attach the BaseSessionSchema
SessionSchema.add(BaseSessionSchema);
