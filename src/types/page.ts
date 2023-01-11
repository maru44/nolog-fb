import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { blockWithChildren } from 'src/types/notion'

export type ListPage = 'home' | 'indie' | 'anime'

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
