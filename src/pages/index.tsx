import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Head from 'next/head'
import Link from 'next/link'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { blogDatabaseId, getStorageURL } from 'src/config'
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
        <meta property="og:title" content="Maru's Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Blog" />
        <meta name="twitter:image" content={getStorageURL('kirloy.jpg')} />
      </Head>

      <main className={styles.container}>
        <Header />
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const { slug, id, title, date, excerpt, icon } = getData(post)
            return (
              <li key={id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${slug}`}>
                    {icon ? `${icon} ` : ''}
                    {title}
                  </Link>
                </h3>
                <p className={styles.postDescription}>{excerpt}</p>
                <p className={styles.postDescription}>{date}</p>
                <Link href={`/${slug}`}>Read post →</Link>
              </li>
            )
          })}
        </ol>
      </main>
      <hr className="divider" />
      <Footer />
    </div>
  )
}

export const getStaticProps = async () => {
  let filter
  if (process.env.NODE_ENV === 'production') {
    filter = {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    }
  }
  const database = await getDatabase(
    blogDatabaseId,
    [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
    filter
  )

  return {
    props: {
      posts: database,
    },
  }
}
