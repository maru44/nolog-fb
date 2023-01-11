import { GetStaticProps } from 'next'
import Head from 'next/head'
import { Chip, ColorFromAnimeStatus } from 'src/components/Chip'
import { animeDatabaseId, getStorageURL } from 'src/config'
import { getAnimeData, getDatabase } from 'src/lib/notion'
import styles from 'src/styles/animes.module.css'
import { ListPageProps } from 'src/types/page'

const Animes = ({ data }: ListPageProps) => {
  return (
    <div>
      <Head>
        <title>Maru&apos;s Anime</title>
        <meta property="og:title" content="Maru's Anime" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Anime" />
        <meta name="twitter:image" content={getStorageURL('kilroy.jpg')} />
      </Head>
      <main className={styles.container}>
        <h2 className={styles.heading}>Anime Scoring</h2>
        <ol className={styles.posts}>
          {data &&
            data.map((v, i) => {
              const { name, scoreStr, status } = getAnimeData(v)
              return (
                <li key={i} className={styles.post}>
                  <div>
                    <p className={styles.animeName}>
                      <b>{name}</b>
                    </p>
                    <div className={styles.animeScore}>{scoreStr}</div>
                    <div className={styles.animeStatus}>
                      <Chip status={ColorFromAnimeStatus(status)} value={status} />
                    </div>
                  </div>
                </li>
              )
            })}
        </ol>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ListPageProps> = async () => {
  const database = await getDatabase(animeDatabaseId, [
    {
      property: 'Score',
      direction: 'descending',
    },
  ])

  return {
    props: {
      data: database,
      page: 'anime',
    },
  }
}

export default Animes
