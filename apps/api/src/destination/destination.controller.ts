import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DestinationService } from './destination.service';

@ApiBearerAuth('access-token')
@Controller()
@ApiTags('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}
}
