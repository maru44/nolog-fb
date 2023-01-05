import { Client } from '@notionhq/client'
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { Blog } from 'src/types/blog'
import { blockWithChildren } from 'src/types/notion'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return response.results
}

export const getPageSlug = (page: PageObjectResponse) => {
  return page.properties.Slug.type === 'rich_text' ? page.properties.Slug.rich_text[0].plain_text : ''
}

export const getData = (page: PageObjectResponse): Blog => {
  const id = page.id
  let title: string = '',
    slug: string = '',
    excerpt: string = '',
    date: string = '',
    category: string = '',
    tags: string[] = [],
    published: boolean = false
  if (page.properties.Page.type === 'title') {
    title = page.properties.Page.title[0].plain_text
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
  return { id, title, slug, excerpt, date, category, published, tags }
}

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
}

// export const getBlocks = async (blockId: string) => {
//   const blocks = []
//   let cursor: string | undefined
//   while (true) {
//     const { results, next_cursor } = await notion.blocks.children.list({
//       start_cursor: cursor,
//       block_id: blockId,
//     })
//     blocks.push(...results)
//     if (!next_cursor) {
//       break
//     }
//     cursor = next_cursor
//   }
//   return blocks
// }

export const getBlocks = async (blockId: string) => {
  const blocks: blockWithChildren[] = []
  let cursor: undefined | string = undefined

  while (true) {
    const blocksList = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })
    blocks.push(...(blocksList.results as BlockObjectResponse[]))

    const next_cursor = blocksList.next_cursor as string | null
    if (!next_cursor) {
      break
    }
    cursor = next_cursor
  }
  return blocks
}
