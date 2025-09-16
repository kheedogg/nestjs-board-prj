import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const salt = await bcrypt.genSalt();
        const { username, password } = authCredentialsDto;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = { username, password: hashedPassword };

        try {
            await this.userRepository.save(user as User);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne(username);
        if (user && await bcrypt.compare(password, user.password)) {
            // jwt 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);
            // return 'logInSuccess';
            return { accessToken };
        } else {
            throw new UnauthorizedException('logInFailed');
        }
    }

}
