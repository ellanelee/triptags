import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { User } from '@prisma/client';
import { CurrentUser } from '@/common/decorator/current_user.decorator';
import { JwtAccessGuard } from '@/auth/jwt-auth.guard.ts/jwt-auth.access.guard';
import { TagCreateDto } from './dtos/tagcreate.dto';

@ApiTags('tags')
@ApiBearerAuth('access-token')
@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get(':venueId')
  async getTags(@Param('venueId') venueId: string) {
    return await this.tagService.findAllTags(venueId);
  }

  @Post(':venueId')
  @UseGuards(JwtAccessGuard)
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
    return { message: 'tags created' };
  }
}
