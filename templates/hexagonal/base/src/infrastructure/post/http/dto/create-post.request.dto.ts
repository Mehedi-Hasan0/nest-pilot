import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsUUID } from 'class-validator';

export class CreatePostRequestDto {
  @ApiProperty({ example: 'My First Blog Post' })
  @IsString()
  @MinLength(3)
  public title!: string;

  @ApiProperty({ example: 'This is the content of the post...' })
  @IsString()
  @MinLength(10)
  public content!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  public authorId!: string;
}
