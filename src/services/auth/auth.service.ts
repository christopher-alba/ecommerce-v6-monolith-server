import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/mongodb/session.schema';
import { User } from 'src/mongodb/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Session.name) private SessionModel: Model<Session>,
  ) {}

  async signIntoClient(
    user: Express.User,
    deviceInfo: UAParser.IResult,
    token: string,
  ) {
    const existingUser = await this.UserModel.find({ userId: user['userId'] });

    //check if user already exists in database
    if (existingUser.length === 0 || !existingUser) {
      await this.UserModel.create({
        userId: user['userId'],
        email: user['email'] ?? '',
      });
    }

    //check if a session already exists in the database
    const existingSessions = await this.SessionModel.find({
      userId: user['userId'],
    });

    //delete previously active session if it exists
    if (existingSessions && existingSessions.length > 0)
      await this.SessionModel.deleteMany({ userId: user['userId'] });

    //create a new session
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await this.SessionModel.create({
      userId: user['userId'],
      token: token,
      deviceInfo: {
        browserName: deviceInfo.browser.name,
        osName: deviceInfo.os.name,
      },
      expiresOn: tomorrow,
    });
  }
}
