import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credential.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const salt = await bcrypt.genSalt();
        const { username, password } = authCredentialsDto;
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.userRepository.create({ username, password: hashedPassword });

        try {
            await this.userRepository.save(user);
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
        const user = await this.userRepository.findOne({ where: { username } });
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