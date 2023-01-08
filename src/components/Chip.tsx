import styles from 'src/styles/components/chip.module.css'
import { AnimeStatus } from 'src/types/anime'

type ChipStatus = 'success' | 'error' | 'warning' | 'disabled'
type ChipLikeStatus = 'love' | 'like' | 'middle' | 'dislike' | 'unknown'

type ChipProps = {
  value: string
  status: ChipStatus | ChipLikeStatus
}

export const Chip = ({ value, status }: ChipProps) => {
  return (
    <span className={styles.chip} style={{ backgroundColor: chipColor(status) }}>
      {value}
    </span>
  )
}

export const ColorFromAnimeStatus = (status: AnimeStatus): ChipLikeStatus => {
  switch (status) {
    case 'multiple complete':
      return 'love'
    case 'complete':
      return 'like'
    case 'watching':
      return 'middle'
    case 'abandon':
      return 'dislike'
    case 'unknown':
      return 'unknown'
  }
}

const chipColor = (status: ChipStatus | ChipLikeStatus) => {
  switch (status) {
    case 'success':
    case 'middle':
      return '#5AE200'
    case 'error':
      return '#e82727'
    case 'warning':
      return '#fdce00'
    case 'disabled':
    case 'unknown':
      return ' #808080'
    case 'dislike':
      return '#599BFF'
    case 'love':
      return '#FF8C72'
    case 'like':
      return '#F4BC69'
  }
}
