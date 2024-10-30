import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { RequestSession } from '@/types/iamRequest.type';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserCredentialsDto } from './dtos/userCredentials.dto';
import { StandardResponse } from '@/types/apiResponse.type';
import { ZodValidationPipe } from '@/validators/zod.validator';
import { createUserSchema } from './schemas/createUser.schema';
import { userCredentialsSchema } from './schemas/userCredentials.schema';
import { SkipAuth } from '@/utils/skipAuth.utils';
import { Response } from 'express';
import { setCookie } from '@/utils/cookie.utils';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import AdminEnum from '@/enum/admin.enum';
import { envConfig } from '@/config/env.config';

@Controller({
  path: '/api/auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly createUserDto: CreateUserDto,
    private readonly userCredentialsDto: UserCredentialsDto,
  ) {}

  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @SkipAuth()
  @ApiResponse({ status: 200 })
  async registerUser(
    @Body() body: CreateUserDto,
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StandardResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.registerUser(
      this.createUserDto.hydrate(body),
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }

    request.session.refreshToken = refreshToken;
    request.session.accessToken = accessToken;

    setCookie(response, { name: 'refreshToken', value: refreshToken });

    request.session.save();
    return {
      provided: { accessToken },
      message: 'register',
      success: true,
    };
  }

  @Post('/login')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(userCredentialsSchema))
  @SkipAuth()
  async loginUser(
    @Body() body: UserCredentialsDto,
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StandardResponse<{ accessToken: string }>> {
    if (
      body.accessFrom === AdminEnum.ADMIN &&
      request.headers.origin !== envConfig.adminUrl
    ) {
      throw new HttpException(
        'Unauthorized access origin',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } = await this.authService.loginUser(
      this.userCredentialsDto.hydrate(body),
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }

    request.session.refreshToken = refreshToken;
    request.session.accessToken = accessToken; // we also save the access token in the session in case frontend doesn't save it

    setCookie(response, { name: 'refreshToken', value: refreshToken });

    request.session.save();
    return {
      provided: { accessToken },
      message: 'login',
      success: true,
    };
  }

  @Get('/logout')
  @HttpCode(201)
  @ApiResponse({ status: 200, description: 'Logout user' })
  async logoutUser(
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StandardResponse<null>> {
    request.session.destroy((err) => {
      if (err) {
        Logger.error(err);
      }
    });

    response.clearCookie('refreshToken');

    return {
      provided: null,
      message: 'logout',
      success: true,
    };
  }
}
