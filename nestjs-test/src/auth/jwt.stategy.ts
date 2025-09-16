import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UserRepository,
    ) {
        super({
            secretOrKey: 'secret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: any) {
        const { username } = payload;
        const user = await this.userRepository.findOne(username);
        
        if(!user) {
            throw new UnauthorizedException('User not found');
        }
        
        return user;
    }
}