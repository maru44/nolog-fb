import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { Footer } from 'src/components/Footer'
import { blogDatabaseId, getStorageURL } from 'src/config'
import { getBlocks, getData, getDatabase, getPageSlug } from 'src/lib/notion'
import styles from 'src/styles/blog.module.css'
import { Blog } from 'src/types/blog'
import { blockWithChildren } from 'src/types/notion'

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
        <meta property="og:title" content={blog.title} />
        <meta property="og:type" content="article" />
        <meta property="description" content={blog.excerpt} />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={getStorageURL('kirloy.jpg')} />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>
          {blog.icon ? `${blog.icon} ` : ''}
          {blog.title}
        </h1>
        <p className={styles.excerpt}>{blog.excerpt}</p>
        <section>
          {blocks.map((block) => (
            <Block key={block.id} block={block} styles={styles} />
          ))}
          <Link href="/" className={styles.back}>
            ← Go Home
          </Link>
        </section>
      </article>
      <hr className="divider" />
      <Footer />
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = await getDatabase(blogDatabaseId)
  return {
    paths: database.map((page) => ({ params: { slug: getPageSlug(page) } })),
    // fallback: 'blocking',
    fallback: false,
  }
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const { slug } = context.params as IParams
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
      blog: getData(page!),
      blocks: blocks,
    },
  }
}
