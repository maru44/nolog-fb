import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Head from 'next/head'
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
        <header className={styles.header}>
          <h1>Indie Works</h1>
        </header>
        <h2 className={styles.heading}>Web Apps</h2>
        <ol className={styles.posts}>
          {indies &&
            indies.map((v) => {
              const { id, title, span, excerpt, icon, skills } = getIndieData(v)
              return (
                <li key={id} className={styles.post}>
                  <h3 className={styles.postTitle}>
                    {icon ? `${icon} ` : ''}
                    {title}
                  </h3>
                  <p className={styles.postDescription}>{excerpt}</p>
                  <p className={styles.postDescription}>{span}</p>
                  <p className={styles.postDescription}>
                    {skills.map((s, i) => (
                      <SkillIcon key={i} skill={s} />
                    ))}
                  </p>
                </li>
              )
            })}
        </ol>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const database = await getDatabase(indieDatabaseId)

  return {
    props: {
      indies: database,
    },
    revalidate: 1,
  }
}

export default Indies
