import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { blogDatabaseId, getStorageURL } from 'src/config'
import { getBlocks, getData, getDatabase, getPageSlug } from 'src/lib/notion'
import styles from 'src/styles/blog.module.css'
import { Blog } from 'src/types/blog'
import { DetailPageProps } from 'src/types/page'

type PostProps = DetailPageProps<Blog>

export default function Post({ data, blocks }: PostProps) {
  if (!blocks) {
    return <></>
  }
  return (
    <div>
      <Head>
        <title>{data.title}</title>
        <meta property="og:title" content={data.title} />
        <meta property="og:type" content="article" />
        <meta property="description" content={data.excerpt} />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.excerpt} />
        <meta name="twitter:image" content={getStorageURL('kilroy.jpg')} />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>
          {data.icon ? `${data.icon} ` : ''}
          {data.title}
        </h1>
        <p className={styles.excerpt}>{data.excerpt}</p>
        <section className={styles.content}>
          {blocks.map((block) => (
            <Block key={block.id} block={block} styles={styles} />
          ))}
          <Link href="/" className={styles.back}>
            ← Go Home
          </Link>
        </section>
      </article>
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = await getDatabase(blogDatabaseId)
  return {
    paths: database.map((page) => ({ params: { slug: getPageSlug(page) } })),
    fallback: false,
  }
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps<PostProps, IParams> = async (context) => {
  const { slug } = context.params!
  const database = (await getDatabase(blogDatabaseId)) as PageObjectResponse[]
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
      data: getData(page!),
      blocks: blocks,
    },
  }
}
