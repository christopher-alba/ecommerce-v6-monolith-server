import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  CreateAdminRequestBody,
  SignIntoClientRequestBody,
  UserInfo,
} from 'src/models/auth';
import { AuthService } from 'src/services/auth/auth.service';
import { UAParser } from 'ua-parser-js';

@Controller('auth/admin')
export class AdminFacingAuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt-admin'))
  async signIntoClient(@Req() req: Request, @Res() res: Response) {
    // Get the User-Agent from the headers
    const userAgent = req.headers['user-agent'];

    // Parse the User-Agent to get device details
    const parser = new UAParser();
    const parsedData = parser.setUA(userAgent).getResult();
    // Log or use the parsed device information
    console.log('Device Info:', JSON.stringify(parsedData));

    const user = req.user;
    console.log(JSON.stringify(user));

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    // The Authorization header is in the format "Bearer <token>"
    const token = authHeader.split(' ')[1]; // Extract the token part

    if (!token) {
      throw new Error('Token is missing');
    }

    const requestBody = req.body as SignIntoClientRequestBody;

    const response = await this.authService.signIntoAdminClient(
      user,
      parsedData,
      token,
      requestBody.userInfo.firstName,
      requestBody.userInfo.lastName,
      requestBody.userInfo.email,
    );
    return res.status(200).json(response);
  }

  @Post('create-admin')
  @UseGuards(AuthGuard('jwt-admin'))
  async CreateAdmin(@Req() req: Request) {
    const requestBody = req.body as CreateAdminRequestBody;
    await this.authService.CreateAdmin(requestBody.secret, requestBody.userSub);
  }
}
