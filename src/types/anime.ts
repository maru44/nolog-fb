export type AnimeStatus = 'complete' | 'multiple complete' | 'watching' | 'abandon' | 'unknown'

export type Anime = {
  name: string
  score: number | null
  scoreStr: string
  status: AnimeStatus
}
