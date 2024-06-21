import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type PodcastDocument = HydratedDocument<Podcast>

@Schema()
export class Podcast {
  @Prop()
  author: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  authorId: Types.ObjectId

  @Prop()
  authorImageUrl: string

  @Prop()
  podcastTitle: string

  @Prop()
  podcastDescription: string

  @Prop()
  audioUrl: string

  @Prop()
  imageUrl: string

  @Prop()
  voicePrompt: string

  @Prop()
  imagePrompt: string

  @Prop()
  voiceType: string

  @Prop()
  audioDuration: number

  @Prop()
  views: number

  @Prop()
  type: 'private' | 'public'
}
export const PodcastSchema = SchemaFactory.createForClass(Podcast)