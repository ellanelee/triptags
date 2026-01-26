import { Controller } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth('iwt-access')
@ApiTags('venueTags')
@Controller()
export class VenueTagController {}
