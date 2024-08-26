import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { IamService } from './iam.service';
import { RequestSession, UserUuidRequest } from '@/types/iamRequest.type';
import { StandardResponse } from '@/types/apiResponse.type';
import { UserOutput } from './output/user.output';
import { ApiResponse } from '@nestjs/swagger';

@Controller({
  path: '/api/iam',
  version: '1',
})
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Get('/user')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get user by uuid',
  })
  async getUser(
    @Body() body: UserUuidRequest,
    @Req() request: RequestSession,
  ): Promise<StandardResponse<UserOutput>> {
    if (body.uuid) {
      const user = new UserOutput(
        await this.iamService.getUserByUuid(body.uuid),
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
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get authenticated user',
  })
  async getMe(
    @Req() request: RequestSession,
  ): Promise<StandardResponse<UserOutput>> {
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
}
