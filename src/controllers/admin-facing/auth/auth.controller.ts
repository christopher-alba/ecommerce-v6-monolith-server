import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignIntoClientRequestBody, UserInfo } from 'src/models/auth';
import { AuthService } from 'src/services/auth/auth.service';
import { UAParser } from 'ua-parser-js';

@Controller('auth/admin')
export class AdminFacingAuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt-admin'))
  async signIntoClient(@Req() req: Request) {
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

    await this.authService.signIntoAdminClient(
      user,
      parsedData,
      token,
      requestBody.userInfo.firstName,
      requestBody.userInfo.lastName,
      requestBody.userInfo.email,
    );
  }
}
