import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminSession } from 'src/mongodb/admin-session.schema';
import { AdminUser, Permission } from 'src/mongodb/admin-user.schema';
import { Session } from 'src/mongodb/session.schema';
import { User } from 'src/mongodb/user.schema';
import { faker } from '@faker-js/faker';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Session.name) private SessionModel: Model<Session>,
    @InjectModel(AdminUser.name) private AdminUserModel: Model<AdminUser>,
    @InjectModel(AdminSession.name)
    private AdminSessionModel: Model<AdminSession>,
  ) {}

  async signIntoClient(
    user: Express.User,
    deviceInfo: UAParser.IResult,
    token: string,
    firstName: string,
    lastName: string,
    email: string,
  ) {
    const existingUser = await this.UserModel.find({ userId: user['userId'] });

    //check if user already exists in database
    if (existingUser.length === 0 || !existingUser) {
      await this.UserModel.create({
        userId: user['userId'],
        email: email ?? '',
        firstName: firstName ?? faker.animal.petName(),
        lastName: lastName ?? faker.food.fruit(),
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

    const response = await this.SessionModel.create({
      userId: user['userId'],
      token: token,
      deviceInfo: {
        browserName: deviceInfo.browser.name,
        osName: deviceInfo.os.name,
      },
      expiresOn: tomorrow,
    });
    console.log('response', response);
    return response;
  }

  async signIntoAdminClient(
    user: Express.User,
    deviceInfo: UAParser.IResult,
    token: string,
    firstName: string,
    lastName: string,
    email: string,
  ) {
    const existingUser = await this.AdminUserModel.find({
      userId: user['userId'],
    });

    //check if user already exists in database
    if (existingUser.length === 0 || !existingUser) {
      await this.AdminUserModel.create({
        userId: user['userId'],
        email: email ?? '',
        permission: Permission.NONE,
        firstName: firstName ?? faker.animal.petName(),
        lastName: lastName ?? faker.food.fruit(),
      });
    }

    //check if a session already exists in the database
    const existingSessions = await this.AdminSessionModel.find({
      userId: user['userId'],
    });

    //if no permissions, dont create a new session
    if (
      existingUser.length === 0 ||
      !existingUser ||
      existingUser[0]?.permission === Permission.NONE
    ) {
      return;
    }

    if (existingSessions && existingSessions.length > 0)
      //delete previously active session if it exists
      await this.AdminSessionModel.deleteMany({ userId: user['userId'] });

    //create a new session
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return await this.AdminSessionModel.create({
      userId: user['userId'],
      token: token,
      deviceInfo: {
        browserName: deviceInfo.browser.name,
        osName: deviceInfo.os.name,
      },
      expiresOn: tomorrow,
    });
  }

  async CreateAdmin(secret: string, userSub: string) {
    //check if secret matches the one stored in .env or render.
    if (secret !== process.env.CREATE_ADMIN_SECRET) return;

    const existingUser = await this.AdminUserModel.findOne({ userId: userSub });

    //check if user doesnt exist
    if (!existingUser) return;

    existingUser.permission = Permission.ADMIN;
    existingUser.save();
  }
}
