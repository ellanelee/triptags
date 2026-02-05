import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUUID } from "class-validator"

export class RegionSearchDto {
  @ApiProperty({
    example: "경주",
    description:
      "검색하고자 하는 국가(KR)/시도(경상북도)/시군구(경주) 형태로 입력",
  })
  @IsString()
  code!: string

  @ApiProperty({
    example: "04272807-29dd-4218-a1dd-3a49e90a938a",
    description:
      "검색하고자 하는 국가(KR)/시도(경상북도)/시군구(경주) 형태로 입력",
  })
  @IsOptional()
  @IsUUID()
  parentId?: string
}
