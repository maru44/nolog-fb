import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { Chip } from 'src/components/Chip'
import { SkillIcon } from 'src/components/SkillIcon'
import { getStorageURL, indieDatabaseId } from 'src/config'
import { getDatabase, getIndieData } from 'src/lib/notion'
import styles from 'src/styles/indies.module.css'
import { ListPageProps, titleWithIcon } from 'src/types/page'

const Indies = ({ data }: ListPageProps) => {
  return (
    <div>
      <Head>
        <title>Maru&apos;s Indie Works</title>
        <meta property="og:title" content="Maru's Indie Works" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Maru's Indie Works" />
        <meta name="twitter:image" content={getStorageURL('kilroy.jpg')} />
      </Head>
      <main className={styles.container}>
        <h2 className={styles.heading}>Web Apps</h2>
        <ol className={styles.posts}>
          {data &&
            data.map((v) => {
              const { id, title, span, excerpt, icon, skills, url, slug, status } = getIndieData(v)
              return (
                <li key={id} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    <Link href={`/indie/${slug}`}>{titleWithIcon(title, icon)}</Link>
                  </h3>
                  {status !== 'unknown' && (
                    <div className={styles.chip}>
                      <Chip value={status} status={status === 'active' ? 'success' : 'disabled'} />
                    </div>
                  )}
                  <p className={styles.postDescription}>{excerpt}</p>
                  <p className={styles.postDescription}>{span}</p>
                  <div className={styles.skills}>
                    {skills.map((s, i) => (
                      <div key={i} className={styles.skill}>
                        <SkillIcon skill={s} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.links}>
                    <div>
                      <Link href={`/indie/${slug}`}>Detail</Link>
                    </div>
                    {url && (
                      <div>
                        <Link href={url} target="_blank">
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
