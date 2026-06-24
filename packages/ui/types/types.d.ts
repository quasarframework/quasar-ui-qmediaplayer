export type NumberArray = number[]
export type StringArray = string[]

export type MediaPlayerType = 'video' | 'audio'
export type CrossOrigin = 'anonymous' | 'use-credentials' | null
export type ClassOrStyle = string | Record<string, unknown> | undefined

export interface MediaSource {
  src?: string
  type?: string
}

export interface MediaTrack {
  kind?: string
  label?: string
  src?: string
  srclang?: string
}

export interface PlaybackRateOption {
  label: string
  value: number
}
