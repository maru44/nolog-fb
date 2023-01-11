export type AnimeStatus = 'complete' | 'multiple complete' | 'watching' | 'abandon' | 'unknown'

export type Anime = {
  id: string
  name: string
  score: number | null
  scoreStr: string
  status: AnimeStatus
}
