import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { databaseId } from 'src/config'
import styles from 'src/styles/post.module.css'
import { Blog } from 'src/types/blog'
import { blockWithChildren } from 'src/types/notion'
import { getBlocks, getData, getDatabase, getPageSlug } from '../lib/notion'

type PostProps = {
  blocks: blockWithChildren[]
  blog: Blog
}

export default function Post({ blog, blocks }: PostProps) {
  if (!blocks) {
    return <></>
  }
  return (
    <div>
      <Head>
        <title>{blog.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>{blog.title}</h1>
        <p>{blog.excerpt}</p>
        <section>
          {blocks.map((block) => (
            <Block key={block.id} block={block} styles={styles} />
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
      blog: getData(page!),
      blocks: blocks,
    },
    revalidate: 1,
  }
}