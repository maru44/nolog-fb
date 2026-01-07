export type AnimeStatus =
  | 'complete'
  | 'many'
  | 'watching'
  | 'abandon'
  | 'unknown'

export type Anime = {
  id: string
  name: string
  score: number | null
  scoreStr: string
  status: AnimeStatus
}
