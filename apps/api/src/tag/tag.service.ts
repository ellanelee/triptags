import { PrismaService } from '@/prisma/prisma.service';
import { VenueService } from '@/venue/venue.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private venueService: VenueService,
  ) {}

  async createTags(
    userId: string,
    venueId: string,
    tags: string[],
    isSystemTag: boolean,
  ) {
    for (const tagName of tags) {
      const normalizeTagName = tagName.trim();
      if (!normalizeTagName) continue;
      const data = {
        tagName: normalizeTagName,
        systemTag: isSystemTag,
        creatorId: userId,
      };
      const tag = await this.prisma.client.tag.create({
        data: { ...data },
      });
      await this.prisma.client.venueTag.create({
        data: {
          venueId,
          tagId: tag.id,
        },
      });
    }
  }
}
