import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [JwtModule.register({}),
    UserModule,
    TokenModule
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
