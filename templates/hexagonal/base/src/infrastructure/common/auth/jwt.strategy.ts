import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT payload shape as defined by PRD §9 (payload minimalism).
 * The token contains only the user ID — no PII like email or display name.
 * If additional user data is needed after authentication, it is fetched
 * from the database using the userId from this payload.
 */
interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  public validate(payload: JwtPayload): { userId: string } {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    // Attach to request.user — downstream handlers access current user via @CurrentUser()
    return { userId: payload.sub };
  }
}
