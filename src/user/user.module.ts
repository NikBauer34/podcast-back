import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), JwtModule.register({})],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
