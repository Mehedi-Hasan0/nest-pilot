import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength } from 'class-validator';

export class AddCommentRequestDto {
  @ApiProperty({ example: 'This is a great post!' })
  @IsString()
  @MaxLength(500)
  public content!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  public authorId!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  public postId!: string;
}
