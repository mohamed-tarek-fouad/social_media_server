/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
      sessionStorage: false,
    });
  }

  async validate(payload: any) {
    const token = await this.authService.validateToken(payload.user.tokenId);
    if (!token) {
      throw new UnauthorizedException();
    }
    return {
      tokenId: payload.user.tokenId,
      userId: payload.user.userId,
      role: payload.user.role,
    };
  }
}
