import { ApiProperty } from "@nestjs/swagger"

export class TagCreateDto {
  @ApiProperty({
    example: ["콩국수, 한식, 여의도 맛집"],
    description: "장소에 관련된 tag",
  })
  tags!: string[]
}
