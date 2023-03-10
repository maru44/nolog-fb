import { Client } from '@notionhq/client'
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Anime, AnimeStatus } from 'src/types/anime'
import { Blog } from 'src/types/blog'
import { Indie, IndieStatus } from 'src/types/indie'
import { blockWithChildren } from 'src/types/notion'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// ref: https://www.npmjs.com/package/@notionhq/client
export const getDatabase = async (
  databaseId: string,
  sorts?:
    | (
        | {
            property: string
            direction: 'ascending' | 'descending'
          }
        | {
            timestamp: 'created_time' | 'last_edited_time'
            direction: 'ascending' | 'descending'
          }
      )[]
    | undefined,
  filter?: {
    property: string
    checkbox: {
      equals: boolean
    }
  },
  start_cursor?: string
) => {
  let hasNext = true
  let results: PageObjectResponse[] = []
  let cursor = start_cursor
  const finalFilter = filter
    ? {
        and: [
          filter,
          {
            property: 'Name',
            title: {
              does_not_equal: '',
              is_not_empty: true,
            },
          },
        ],
      }
    : {
        property: 'Name',
        title: {
          does_not_equal: '',
          is_not_empty: true,
        },
      }
  while (hasNext) {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: finalFilter,
      sorts: sorts,
      start_cursor: cursor,
    })
    results = results.concat(response.results as PageObjectResponse[])
    hasNext = response.has_more
    if (response.next_cursor) {
      cursor = response.next_cursor
    }
  }
  return results
}

export const getPageSlug = (page: PageObjectResponse) => {
  return page.properties.Slug.type === 'rich_text' ? page.properties.Slug.rich_text[0].plain_text : ''
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

export const getBlocks = async (blockId: string) => {
  const blocks: blockWithChildren[] = []
  let cursor: undefined | string = undefined

  while (true) {
    const blocksList = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })

    const results = blocksList.results as blockWithChildren[]

    for (const c of results) {
      if (c.has_children) {
        const children = await getBlocks(c.id)
        c.children = children
        blocks.push(c)
      } else {
        blocks.push(c)
      }
    }

    const next_cursor = blocksList.next_cursor as string | null
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}

// blog
export const getData = (page: PageObjectResponse): Blog => {
  const id = page.id
  let title: string = '',
    slug: string = '',
    icon: string | null = null,
    excerpt: string = '',
    date: string = '',
    category: string = '',
    tags: string[] = [],
    published: boolean = false
  if (page.properties.Name.type === 'title') {
    title = page.properties.Name.title[0].plain_text
  }
  if (page.properties.Slug.type === 'rich_text') {
    slug = page.properties.Slug.rich_text[0].plain_text
  }
  if (page.properties.Excerpt.type === 'rich_text' && page.properties.Excerpt.rich_text.length > 0) {
    excerpt = page.properties.Excerpt.rich_text[0].plain_text
  }
  if (page.properties.Published.type === 'checkbox') {
    published = page.properties.Published.checkbox
  }
  if (page.properties.Date.type === 'date' && page.properties.Date.date) {
    if (!!page.properties.Date.date.start) {
      date = new Date(page.properties.Date.date.start).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    }
  }
  if (page.properties.Category.type === 'select' && page.properties.Category.select) {
    category = page.properties.Category.select.name
  }
  if (page.properties.Tags.type === 'multi_select') {
    const ts = page.properties.Tags.multi_select
    tags = ts.map((t) => t.name)
  }
  if (page.icon?.type === 'emoji') {
    icon = page.icon.emoji
  }
  return { id, icon, title, slug, excerpt, date, category, published, tags }
}

// indie
export const getIndieData = (page: PageObjectResponse): Indie => {
  const id = page.id
  let title: string = '',
    slug: string = '',
    icon: string | null = null,
    excerpt: string = '',
    span: string = '',
    skills: string[] = [],
    status: IndieStatus = 'unknown',
    url: string | null = null
  if (page.properties.Name.type === 'title') {
    title = page.properties.Name.title[0].plain_text
  }
  if (page.properties.Slug.type === 'rich_text' && page.properties.Slug.rich_text.length > 0) {
    slug = page.properties.Slug.rich_text[0].plain_text
  }
  if (page.properties.Excerpt.type === 'rich_text' && page.properties.Excerpt.rich_text.length > 0) {
    excerpt = page.properties.Excerpt.rich_text[0].plain_text
  }
  if (page.properties.Span.type === 'date' && page.properties.Span.date) {
    let start: string | undefined, end: string | undefined
    if (!!page.properties.Span.date.start) {
      start = new Date(page.properties.Span.date.start).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    }
    if (!!page.properties.Span.date.end) {
      end = new Date(page.properties.Span.date.end).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    }
    if (!end && !start) {
      span = '???'
    } else {
      span = `${start ?? ''} - ${end ?? ''}`
    }
  }
  if (page.properties.Status.type === 'select' && page.properties.Status.select) {
    switch (page.properties.Status.select.name as IndieStatus) {
      case 'active':
        status = 'active'
        break
      case 'inactive':
        status = 'inactive'
        break
    }
  }
  if (page.properties.Skills.type === 'multi_select') {
    const ts = page.properties.Skills.multi_select
    skills = ts.map((t) => t.name)
  }
  if (page.icon?.type === 'emoji') {
    icon = page.icon.emoji
  }
  if (page.properties.URL.type === 'url' && page.properties.URL.url !== null) {
    url = page.properties.URL.url
  }
  return { id, icon, title, slug, excerpt, span, skills, status, url }
}

// anime
export const getAnimeData = (page: PageObjectResponse): Anime => {
  const id = page.id
  let name: string = '',
    status: AnimeStatus = 'unknown',
    score: number | null = null,
    scoreStr: string = '-'
  if (page.properties.Name.type === 'title' && page.properties.Name.title.length > 0) {
    name = page.properties.Name.title[0].plain_text
  }
  if (page.properties.Status.type === 'select' && page.properties.Status.select) {
    status = page.properties.Status.select.name as AnimeStatus
  }
  if (page.properties.Score.type === 'number') {
    score = page.properties.Score.number
    if (!!score) {
      scoreStr = score.toString()
    }
  }
  return { id, name, status, score, scoreStr }
}
