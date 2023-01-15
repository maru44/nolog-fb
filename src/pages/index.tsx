import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { blogDatabaseId, ENV, kilroyPNG } from 'src/config'
import { getData, getDatabase } from 'src/lib/notion'
import styles from 'src/styles/index.module.css'
import { blogTitle } from 'src/types/blog'
import { ListPageProps } from 'src/types/page'

export default function Home({ data }: ListPageProps) {
  return (
    <div>
      <Head>
        <title>Maru</title>
        <meta property="og:title" content="Maru's Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={kilroyPNG} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Blog" />
        <meta name="twitter:image" content={kilroyPNG} />
      </Head>
      <main className={styles.container}>
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {data.map((post) => {
            const blog = getData(post)
            return (
              <li key={blog.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${blog.slug}`}>{blogTitle(blog)}</Link>
                </h3>
                <p className={styles.postDescription}>{blog.excerpt}</p>
                <p className={styles.postDescription}>{blog.date}</p>
                <Link href={`/${blog.slug}`}>Read post →</Link>
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ListPageProps> = async () => {
  let filter
  if (ENV === 'production') {
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
      data: database,
      page: 'blog',
    },
  }
}
