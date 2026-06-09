import { ApiProperty } from '@nestjs/swagger';

export class TagCreateDto {
  @ApiProperty({
    example: ['콩국수', '한식', '여의도 맛집'],
    description: 'tag들을 각각 string으로 구분하여 배열로 입력',
  })
  tags!: string[];
}
