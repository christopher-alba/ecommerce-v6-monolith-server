import { Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

export const BaseSessionSchema = new Schema({
  userId: { type: String, required: true, index: 1 },
  token: { type: String, required: true, index: 1 },
  expiresOn: { type: Date, required: true, index: 1 },
  deviceInfo: {
    type: {
      browserName: { type: String, required: true },
      osName: { type: String, required: true },
    },
    required: true,
  },
});

BaseSessionSchema.pre('save', async function (next) {
  if (this.isModified('token')) {    
    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);
  }
  next();
});
