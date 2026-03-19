import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../application/user/register-user/register-user.use-case';
import { GetUserProfileUseCase } from '../../../application/user/get-user-profile/get-user-profile.use-case';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { RegisterUserCommand } from '../../../application/user/register-user/register-user.command';
import { UserResponseDto } from '../../../application/user/common/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  public async registerUser(@Body() dto: RegisterUserRequestDto): Promise<UserResponseDto> {
    const command = new RegisterUserCommand(dto.email, dto.name, dto.password);
    return this.registerUserUseCase.execute(command);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  public async getUserProfile(@Param('id') id: string): Promise<UserResponseDto> {
    return this.getUserProfileUseCase.execute(id);
  }
}
