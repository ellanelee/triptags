import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class LocalVerificationCreateDto {
  @ApiProperty({
    example: 32.4567,
    description: "경도를 표시하세요",
  })
  @IsNumber()
  longitude!: number

  @ApiProperty({
    example: 32.4567,
    description: "위도를 표시하세요",
  })
  @IsNumber()
  latitude!: number

  @ApiProperty({
    example: "GPS",
    description: "ADDRESS, GPS, ACTIVITY 중에서 선택하세요",
  })
  verificationMethod!: string
}
