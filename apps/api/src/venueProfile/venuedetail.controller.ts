import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('access-token')
@ApiTags('venueDetail')
export class VenueDetailController {}
