import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { RequestSession } from '@/types/iamRequest.type';
import { ZodValidationPipe } from '@/validators/zod.validator';
import { ApiResponse } from '@nestjs/swagger';
import { Group } from '@/entities';
import { StandardResponse } from '@/types/apiResponse.type';
import { createGroupSchema } from './schemas/createGroup.schema';
import { CreateGroupDto } from './dtos/createGroup.dto';
import { GetGroup } from './schemas/getGroup.schema';

@Controller({
  path: '/api/group',
})
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/')
  @UsePipes(new ZodValidationPipe(createGroupSchema))
  @ApiResponse({ status: 201, type: Promise<StandardResponse<Group>> })
  async createGroup(
    @Body() body: CreateGroupDto,
    @Req() request: RequestSession,
  ): Promise<StandardResponse<Group>> {
    try {
      const group = await this.groupService.createGroup(
        request.user,
        body.theaterId,
        body.movieId,
        body.showtimeDate,
      );
      return {
        provided: group,
        message: 'group created',
        success: true,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        "Can't create group",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  async getGroupById(@Param() group: GetGroup) {
    try {
      const groupData = await this.groupService.getById(group.id);
      return {
        provided: groupData,
        message: 'group fetched',
        success: true,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        "Can't fetch group",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
