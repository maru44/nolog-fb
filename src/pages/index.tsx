import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { blogDatabaseId, ENV, getStorageURL } from 'src/config'
import { getData, getDatabase } from 'src/lib/notion'
import styles from 'src/styles/index.module.css'
import { ListPageProps, titleWithIcon } from 'src/types/page'

export default function Home({ data }: ListPageProps) {
  return (
    <div>
      <Head>
        <title>Maru</title>
        <meta property="og:title" content="Maru's Blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Blog" />
        <meta name="twitter:image" content={getStorageURL('kilroy.jpg')} />
      </Head>
      <main className={styles.container}>
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {data.map((post) => {
            const { slug, id, title, date, excerpt, icon } = getData(post)
            return (
              <li key={id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${slug}`}>{titleWithIcon(title, icon)}</Link>
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
      page: 'home',
    },
  }
}
