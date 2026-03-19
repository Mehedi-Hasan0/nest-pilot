import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  public name!: string;

  @ApiProperty({ example: 'SuperSecret123' })
  @IsString()
  @MinLength(6)
  public password!: string;
}
