import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './token.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
  JwtModule.register({})
],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
