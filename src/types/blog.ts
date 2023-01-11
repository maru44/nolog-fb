import { titleWithIcon } from 'src/types/page'

export type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  published: boolean
  icon: string | null
}

export const blogTitle = (d: Blog) => {
  return titleWithIcon(d.title, d.icon)
}
