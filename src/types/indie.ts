import { titleWithIcon } from 'src/types/page'

export type IndieStatus = 'active' | 'inactive' | 'unknown'

export type Indie = {
  id: string
  slug: string
  title: string
  excerpt: string
  skills: string[]
  span: string
  status: IndieStatus
  images: string[]
  icon: string | null
  url: string | null
}

export const indieTitle = (d: Indie) => {
  return titleWithIcon(d.title, d.icon)
}
