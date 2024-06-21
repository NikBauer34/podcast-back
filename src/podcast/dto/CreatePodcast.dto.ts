export class CreatePodcastDto {
  readonly podcastTitle: string
  readonly podcastDescription: string
  readonly audioUrl: string
  readonly imageUrl: string
  readonly voicePrompt: string
  readonly imagePrompt: string
  readonly voiceType: string
  readonly audioDuration: number
  readonly views: number
  readonly type: 'private' | 'public'
}