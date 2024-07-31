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
  UsePipes,
} from '@nestjs/common';
import { IamService } from '../services/iam.service';
import { RequestSession, UserUuidRequest } from 'src/types/iamRequest.type';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserCredentialsDto } from '../dtos/userCredentials.dto';
import { ApiResponse } from 'src/types/apiResponse.type';

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

  @Get('user')
  async getUser(@Req() request: UserUuidRequest) {
    Logger.debug(request.uuid);
    if (request.uuid) {
      return await this.iamService.getUserByUuid(request.uuid);
    }
    throw new HttpException('Error loading user', HttpStatus.BAD_REQUEST);
  }

  @Post('/auth/register')
  @HttpCode(200)
  @UsePipes()
  async registerUser(
    @Body() body: CreateUserDto,
    @Req() request: RequestSession,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.iamService.registerUser(
      this.createUserDto.hydrate(body),
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }

    request.session.userUuid = refreshToken;
    request.session.save();
    return {
      data: { accessToken },
      message: 'register',
      success: true,
    };
  }

  @Post('/auth/login')
  @HttpCode(200)
  async loginUser(
    @Body() body: UserCredentialsDto,
    @Req() request: RequestSession,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } = await this.iamService.loginUser(
      this.userCredentialsDto.hydrate(body),
    );

    if (!accessToken || !refreshToken) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST);
    }

    request.session.userUuid = refreshToken;
    request.session.save();
    return {
      data: { accessToken },
      message: 'login',
      success: true,
    };
  }
}
