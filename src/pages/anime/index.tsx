import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Head from 'next/head'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { animeDatabaseId, getStorageURL } from 'src/config'
import { getAnimeData, getDatabase } from 'src/lib/notion'
import styles from 'src/styles/animes.module.css'

type AnimesProps = {
  animes: PageObjectResponse[]
}

const Animes = ({ animes }: AnimesProps) => {
  return (
    <div>
      <Head>
        <title>Maru&apos;s Anime</title>
        <meta property="og:title" content="Maru's Anime" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Anime" />
        <meta name="twitter:image" content={getStorageURL('kirloy.jpg')} />
      </Head>
      <main className={styles.container}>
        <Header current="anime" />
        <h2 className={styles.heading}>Anime Scoring</h2>
        <ol className={styles.posts}>
          {animes &&
            animes.map((v, i) => {
              const { name, scoreStr, status } = getAnimeData(v)
              if (name === '') return
              return (
                <li key={i} className={styles.post}>
                  <div>
                    <p>
                      <b>{name}</b>
                    </p>
                    <div>{scoreStr}</div>
                    <div>{status}</div>
                  </div>
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
  const database = await getDatabase(animeDatabaseId, [
    {
      property: 'Score',
      direction: 'descending',
    },
  ])

  return {
    props: {
      animes: database,
    },
  }
}

export default Animes
