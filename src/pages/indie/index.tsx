import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Head from 'next/head'
import Link from 'next/link'
import { Chip } from 'src/components/Chip'
import { Header } from 'src/components/Header'
import { SkillIcon } from 'src/components/SkillIcon'
import { indieDatabaseId } from 'src/config'
import { getDatabase, getIndieData } from 'src/lib/notion'
import styles from 'src/styles/indies.module.css'

type IndiesProps = {
  indies: PageObjectResponse[]
}

const Indies = ({ indies }: IndiesProps) => {
  return (
    <div>
      <Head>
        <title>Maru's Indie Works</title>
      </Head>
      <main className={styles.container}>
        <Header current="indie" />
        <h2 className={styles.heading}>Web Apps</h2>
        <ol className={styles.posts}>
          {indies &&
            indies.map((v) => {
              const { id, title, span, excerpt, icon, skills, url, slug, status } = getIndieData(v)
              if (title === '') return
              return (
                <li key={id} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    <Link href={`/indie/${slug}`}>
                      {icon ? `${icon} ` : ''}
                      {title}
                    </Link>
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
                    <div className="">
                      <Link href={`/indie/${slug}`}>Detail</Link>
                    </div>
                    {url && (
                      <div className="">
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

export const getStaticProps = async () => {
  const database = await getDatabase(indieDatabaseId, [
    {
      property: 'Span',
      direction: 'descending',
    },
  ])

  return {
    props: {
      indies: database,
    },
    revalidate: 1,
  }
}

export default Indies
