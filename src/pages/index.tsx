import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Head from 'next/head'
import Link from 'next/link'
import { databaseId } from 'src/config'
import { getData, getDatabase } from 'src/lib/notion'
import styles from 'src/styles/index.module.css'

type PostsProps = {
  posts: PageObjectResponse[]
}

export default function Home({ posts }: PostsProps) {
  return (
    <div>
      <Head>
        <title>Maru</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logos}>
            <img src="/kilroy.jpg" width="50%" />
          </div>
          <h1>Maru</h1>
          <p>
            This is an example of a Next.js blog with data fetched with Notions API. The data comes from{' '}
            <a href={`https://www.notion.so/${databaseId}`}>this table</a>. Get the source code on{' '}
            <a href="https://github.com/samuelkraft/notion-blog-nextjs">Github</a> or read{' '}
            <a href="https://samuelkraft.com/blog/building-a-notion-blog-with-public-api">my blogpost</a> on building your own.
          </p>
        </header>

        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const { slug, id, title, date, excerpt } = getData(post)
            return (
              <li key={id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${slug}`}>{title}</Link>
                </h3>
                <p className={styles.postDescription}>{excerpt}</p>
                <p className={styles.postDescription}>{date}</p>
                <Link href={`/${slug}`}>Read post →</Link>
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  }
}
