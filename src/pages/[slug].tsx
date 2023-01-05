import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Fragment } from 'react'
import { Text } from 'src/components/Text'
import { databaseId } from 'src/config'
import styles from 'src/styles/post.module.css'
// import { Blog } from 'src/types/blog'
import { blockWithChildren } from 'src/types/notion'
import { getBlocks, getDatabase, getPageSlug, getPageTitle } from '../lib/notion'

// const renderNestedList = (block) => {
//   const { type } = block
//   const value = block[type]
//   if (!value) return null

//   const isNumberedList = value.children[0].type === 'numbered_list_item'

//   if (isNumberedList) {
//     return <ol>{value.children.map((block) => renderBlock(block))}</ol>
//   }
//   return <ul>{value.children.map((block) => renderBlock(block))}</ul>
// }

const renderBlock = (block: blockWithChildren) => {
  const { type, id } = block

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text texts={block.paragraph.rich_text} styles={styles} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <Text texts={block.heading_1.rich_text} styles={styles} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <Text texts={block.heading_2.rich_text} styles={styles} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <Text texts={block.heading_3.rich_text} styles={styles} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <Text texts={block.bulleted_list_item.rich_text} styles={styles} />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <Text texts={block.numbered_list_item.rich_text} styles={styles} />
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={block.to_do.checked} /> <Text texts={block.to_do.rich_text} styles={styles} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <Text texts={block.toggle.rich_text} styles={styles} />
          </summary>
          {/* {value.children?.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))} */}
        </details>
      )
    case 'child_page':
      return <p>{block.child_page.title}</p>
    case 'image':
      const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url
      const caption = block.image.caption ? block.image.caption[0]?.plain_text : ''
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    case 'divider':
      return <hr key={id} />
    case 'quote':
      return <blockquote key={id}>{block.quote.rich_text[0].plain_text}</blockquote>
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {block.code.rich_text[0].plain_text}
          </code>
        </pre>
      )
    case 'file':
      const src_file = block.file.type === 'external' ? block.file.external.url : block.file.file.url
      const splitSourceArray = src_file.split('/')
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1]
      const caption_file = block.file.caption ? block.file.caption[0]?.plain_text : ''
      return (
        <figure>
          <div className={styles.file}>
            📎{' '}
            <Link href={src_file} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      )
    case 'bookmark':
      const href = block.bookmark.url
      return (
        <a href={href} target="_brank" className={styles.bookmark}>
          {href}
        </a>
      )
    default:
      return `❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`
  }
}

type PostProps = {
  blocks: blockWithChildren[]
  title?: string
}

export default function Post({ title, blocks }: PostProps) {
  if (!title || !blocks) {
    return <div />
  }
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <article className={styles.container}>
        <h1 className={styles.name}>{title}</h1>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
          <Link href="/" className={styles.back}>
            ← Go home
          </Link>
        </section>
      </article>
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = (await getDatabase(databaseId)) as PageObjectResponse[]
  return {
    paths: database.map((page) => ({ params: { slug: getPageSlug(page) } })),
    fallback: true,
  }
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const { slug } = context.params as IParams
  const database = (await getDatabase(databaseId)) as PageObjectResponse[]
  const page = database.find((page) => getPageSlug(page) === slug)
  const blocks = await getBlocks(page!.id)

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  //   const childBlocks = await Promise.all(
  //     blocks
  //       .filter((block) => block. block.has_children)
  //       .map(async (block) => {
  //         return {
  //           id: block.id,
  //           children: await getBlocks(block.id),
  //         }
  //       })
  //   )
  //   const blocksWithChildren = blocks.map((block) => {
  //     // Add child blocks if the block should contain children but none exists
  //     if (block.has_children && !block[block.type].children) {
  //       block[block.type]['children'] = childBlocks.find((x) => x.id === block.id)?.children
  //     }
  //     return block
  //   })

  return {
    props: {
      title: getPageTitle(page!),
      blocks: blocks,
    },
    revalidate: 1,
  }
}
