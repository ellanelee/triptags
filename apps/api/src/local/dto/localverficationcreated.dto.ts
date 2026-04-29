import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { VerificationMethod } from '@triptags/shared';

export class LocalVerificationCreateDto {
  @ApiProperty({
    example: 'GPS',
    description: 'ADDRESS, GPS, ACTIVITY 중에서 선택하세요',
  })
  @IsNotEmpty()
  verificationMethod!: VerificationMethod;

  @ApiProperty({
    example: 32.4567,
    description: '경도를 표시하세요',
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    example: 32.4567,
    description: '위도를 표시하세요',
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;
}
