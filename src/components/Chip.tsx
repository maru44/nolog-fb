import styles from 'src/styles/components/chip.module.css'

type ChipStatus = 'success' | 'error' | 'warning' | 'disabled'

type ChipProps = {
  value: string
  status: ChipStatus
}

export const Chip = ({ value, status }: ChipProps) => {
  return (
    <span className={styles.chip} style={{ backgroundColor: chipColor(status) }}>
      {value}
    </span>
  )
}

const chipColor = (status: ChipStatus) => {
  switch (status) {
    case 'success':
      return '#5AE200'
    case 'error':
      return '#e82727'
    case 'warning':
      return '#fdce00'
    case 'disabled':
      return ' #808080'
  }
}
