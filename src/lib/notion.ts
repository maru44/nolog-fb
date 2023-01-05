import { Client } from '@notionhq/client'
import { BlockObjectResponse, PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
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

export const getPageTitle = (page: PageObjectResponse) => {
  return page.properties.Page.type === 'title' ? page.properties.Page.title[0].plain_text : ''
}

export const getPageSlug = (page: PageObjectResponse) => {
  return page.properties.Slug.type === 'rich_text' ? page.properties.Slug.rich_text[0].plain_text : ''
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
