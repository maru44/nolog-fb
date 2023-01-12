import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { blockWithChildren } from 'src/types/notion'

export type ListPage = 'blog' | 'indie' | 'anime'

type PageInfo = {
  key: ListPage
  path: string
  desc: string
}

export const listPageInfo: PageInfo[] = [
  {
    key: 'blog',
    path: '/',
    desc: 'A liberarian. An web engineer.',
  },
  {
    key: 'indie',
    path: '/indie',
    desc: 'Indie Works',
  },
  {
    path: '/anime',
    key: 'anime',
    desc: 'Just my personal opinion',
  },
]

export type ListPageProps = {
  data: PageObjectResponse[]
  page: ListPage
}

export type DetailPageProps<T> = {
  blocks: blockWithChildren[]
  data: T
}

export const titleWithIcon = (title: string, icon: string | null) => {
  if (!icon) return title
  return `${icon} ${title}`
}
