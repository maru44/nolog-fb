import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { baseURL, blogDatabaseId, ENV, shiroJPGFlat } from 'src/config'
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
        <meta property="og:image" content={shiroJPGFlat} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.excerpt} />
        <meta name="twitter:image" content={shiroJPGFlat} />
        <link rel="canonical" href={`${baseURL}/${data.slug}/`} />
        {data.icon && (
          <link
            rel="shortcut icon"
            href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>${data.icon}</text></svg>`}
          />
        )}
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

export const getStaticProps: GetStaticProps<PostProps, IParams> = async (
  context,
) => {
  const { slug } = context.params!
  const database = (await getDatabase(blogDatabaseId)) as PageObjectResponse[]
  const page = database.find((page) => getPageSlug(page) === slug)
  const blocks = await getBlocks(page!.id)

  const data = getData(page!)
  // publishされていないものは隠す
  if (ENV === 'production' && !data.published) {
    return {
      notFound: true,
      revalidate: true,
    }
  }

  return {
    props: {
      data,
      blocks,
    },
  }
}
