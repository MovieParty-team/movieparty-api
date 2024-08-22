import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { IamService } from './iam.service';
import { RequestSession, UserUuidRequest } from '@/types/iamRequest.type';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserCredentialsDto } from './dtos/userCredentials.dto';
import { ApiResponse } from '@/types/apiResponse.type';
import { ZodValidationPipe } from '@/api/validators/zod.validator';
import { createUserSchema } from './schemas/createUser.schema';
import { userCredentialsSchema } from './schemas/userCredentials.schema';
import { SkipAuth } from '@/utils/skipAuth.utils';
import { UserOutput } from './output/user.output';
import { Response } from 'express';
import { setCookie } from '@/utils/cookie.utils';

@Controller({
  path: '/api',
  version: '1',
})
export class IamController {
  constructor(
    private readonly iamService: IamService,
    private readonly createUserDto: CreateUserDto,
    private readonly userCredentialsDto: UserCredentialsDto,
  ) {}

  @Get('/user')
  async getUser(
    @Query() query: UserUuidRequest,
    @Req() request: RequestSession,
  ): Promise<ApiResponse<UserOutput>> {
    Logger.debug(query.uuid);
    if (query.uuid) {
      const user = new UserOutput(
        await this.iamService.getUserByUuid(query.uuid),
      );
      return {
        provided: user,
        message: 'user',
        success: true,
        accessToken: request.session.accessToken,
      };
    }
    throw new HttpException('Error loading user', HttpStatus.BAD_REQUEST);
  }

  @Get('/user/me')
  async getMe(
    @Req() request: RequestSession,
  ): Promise<ApiResponse<UserOutput>> {
    const user = new UserOutput(
      await this.iamService.getUserByUuid(request.user),
    );
    return {
      provided: user,
      message: 'user',
      success: true,
      accessToken: request.session.accessToken,
    };
  }

  @Post('/auth/register')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @SkipAuth()
  async registerUser(
    @Body() body: CreateUserDto,
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.iamService.registerUser(
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

  @Post('/auth/login')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(userCredentialsSchema))
  @SkipAuth()
  async loginUser(
    @Body() body: UserCredentialsDto,
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.iamService.loginUser(
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

  @Get('/auth/logout')
  @HttpCode(200)
  async logoutUser(
    @Req() request: RequestSession,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponse<null>> {
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
