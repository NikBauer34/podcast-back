import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/user.model";

export type TokenDocument = HydratedDocument<Token>
@Schema()
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User

  @Prop()
  refreshToken: string
}
export const TokenSchema = SchemaFactory.createForClass(Token)