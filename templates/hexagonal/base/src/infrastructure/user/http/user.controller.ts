import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../../application/user/register-user/register-user.use-case';
import { GetUserProfileUseCase } from '../../../application/user/get-user-profile/get-user-profile.use-case';
import { RegisterUserRequestDto } from './dto/register-user.request.dto';
import { RegisterUserCommand } from '../../../application/user/register-user/register-user.command';
import { Public } from '../../common/auth/public.decorator';
import { UserPresenter, UserHttpResponse } from './user.presenter';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Public() // Registration is open — no JWT required
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  public async registerUser(@Body() dto: RegisterUserRequestDto): Promise<UserHttpResponse> {
    const result = await this.registerUserUseCase.execute(
      new RegisterUserCommand(dto.email, dto.name, dto.password),
    );
    return UserPresenter.toResponse(result);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile returned successfully' })
  public async getUserProfile(@Param('id') id: string): Promise<UserHttpResponse> {
    const result = await this.getUserProfileUseCase.execute(id);
    return UserPresenter.toResponse(result);
  }
}
