import { PrismaService } from '@/prisma/prisma.service';
import { VenueService } from '@/venue/venue.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
  constructor(
    private prisma: PrismaService,
    private venueService: VenueService,
  ) {}

  async getTagByName(tagName: string) {
    return await this.prisma.client.tag.findUnique({
      where: { tagName: tagName },
    });
  }

  async findAllTags(venueId: string) {
    const data = await this.prisma.client.venueTag.findMany({
      where: { venueId: venueId },
      select: {
        tags: {
          select: {
            tagName: true,
          },
        },
      },
    });
    const result = data.map((el) => el.tags.tagName);
    console.log(result);
    return result;
  }

  async createTags(
    userId: string,
    venueId: string,
    tags: string[],
    isSystemTag: boolean,
  ) {
    for (const tagName of tags) {
      const normalizeTagName = tagName.trim();
      const alreadyRegistered = await this.getTagByName(normalizeTagName);
      if (!alreadyRegistered) {
        const data = {
          tagName: normalizeTagName,
          systemTag: isSystemTag,
          creatorId: userId,
        };
        const tag = await this.prisma.client.tag.create({
          data: { ...data },
        });
        await this.prisma.client.venueTag.upsert({
          where: {
            venueId_tagId: {
              venueId: venueId,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            venueId,
            tagId: tag.id,
          },
        });
      }
    }
  }
}
