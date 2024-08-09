import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Chip } from 'src/components/Chip'
import { SkillIcon } from 'src/components/SkillIcon'
import { baseURL, indieDatabaseId, shiroJPGFlat } from 'src/config'
import { getDatabase, getIndieData } from 'src/lib/notion'
import styles from 'src/styles/indies.module.css'
import { indieTitle } from 'src/types/indie'
import { ListPageProps } from 'src/types/page'

const Indies = ({ data }: ListPageProps) => {
  return (
    <div>
      <Head>
        <title>Maru&apos;s Indie Works</title>
        <meta property="og:title" content="Maru's Indie Works" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={shiroJPGFlat} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Indie Works" />
        <meta name="twitter:image" content={shiroJPGFlat} />
        <link rel="canonical" href={`${baseURL}/indie/`} />
      </Head>
      <main className={styles.container}>
        <h2 className={styles.heading}>Web Apps</h2>
        <ol className={styles.posts}>
          {data &&
            data.map((v) => {
              const indie = getIndieData(v)
              return (
                <li key={indie.id} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    <Link href={`/indie/${indie.slug}`}>{indieTitle(indie)}</Link>
                  </h3>
                  {indie.status !== 'unknown' && (
                    <div className={styles.chip}>
                      <Chip value={indie.status} status={indie.status === 'active' ? 'success' : 'disabled'} />
                    </div>
                  )}
                  <p className={styles.postDescription}>{indie.excerpt}</p>
                  <p className={styles.postDescription}>{indie.span}</p>
                  <div className={styles.skills}>
                    {indie.skills.map((s, i) => (
                      <div key={i} className={styles.skill}>
                        <SkillIcon skill={s} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.links}>
                    <div>
                      <Link href={`/indie/${indie.slug}`}>Detail</Link>
                    </div>
                    {indie.url && (
                      <div>
                        <Link href={indie.url} target="_blank">
                          Go
                        </Link>
                      </div>
                    )}
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
  const database = await getDatabase(indieDatabaseId, [
    {
      property: 'Span',
      direction: 'descending',
    },
  ])

  return {
    props: {
      data: database,
      page: 'indie',
    },
  }
}

export default Indies
