import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { TagCreateDto } from '@triptags/shared';
import { User } from '@prisma/client';
import { CurrentUser } from '@/common/decorator/current_user.decorator';

@ApiBasicAuth('iwt-access')
@ApiTags('venueTags')
@Controller()
export class TagController {
  constructor(private tagService: TagService) {}

  @Post(':venueId/user')
  @ApiBasicAuth('jwt-access')
  async createTags(
    @CurrentUser() user: User,
    @Param('venueId') venueId: string,
    @Body() tagCreateDto: TagCreateDto,
  ) {
    const systemTag = false;
    await this.tagService.createTags(
      user.id,
      venueId,
      tagCreateDto.tags,
      systemTag,
    );
  }
}
