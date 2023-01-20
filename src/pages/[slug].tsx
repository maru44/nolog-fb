import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { blogDatabaseId, kilroyPNG } from 'src/config'
import { getBlocks, getData, getDatabase, getPageSlug } from 'src/lib/notion'
import styles from 'src/styles/blog.module.css'
import { Blog, blogTitle } from 'src/types/blog'
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
        <meta name="description" content={data.excerpt} />
        <meta property="og:title" content={data.title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={data.excerpt} />
        <meta property="og:image" content={kilroyPNG} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.excerpt} />
        <meta name="twitter:image" content={kilroyPNG} />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>{blogTitle(data)} </h1>
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

  return {
    props: {
      data: getData(page!),
      blocks: blocks,
    },
  }
}
