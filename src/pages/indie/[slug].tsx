import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { Chip } from 'src/components/Chip'
import { Footer } from 'src/components/Footer'
import { SkillIcon } from 'src/components/SkillIcon'
import { getStorageURL, indieDatabaseId } from 'src/config'
import { getBlocks, getDatabase, getIndieData, getPageSlug } from 'src/lib/notion'
import styles from 'src/styles/indie.module.css'
import { Indie } from 'src/types/indie'
import { blockWithChildren } from 'src/types/notion'

type IndieProps = {
  blocks: blockWithChildren[]
  indie: Indie
}

export default function IndieDetail({ indie, blocks }: IndieProps) {
  if (!blocks) return <></>

  return (
    <div>
      <Head>
        <title>{indie.title}</title>
        <meta property="og:title" content={indie.title} />
        <meta property="og:type" content="article" />
        <meta property="description" content={indie.excerpt} />
        <meta property="og:image" content={getStorageURL('kilroy.jpg')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={indie.title} />
        <meta name="twitter:description" content={indie.excerpt} />
        <meta name="twitter:image" content={getStorageURL('kirloy.jpg')} />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>
          {indie.icon ? `${indie.icon} ` : ''}
          {indie.title}
        </h1>
        {indie.status !== 'unknown' && (
          <div className={styles.chip}>
            <Chip value={indie.status} status={indie.status === 'active' ? 'success' : 'disabled'} />
          </div>
        )}
        <p className={styles.excerpt}>{indie.excerpt}</p>
        <div>
          <p className={styles.postDescription}>{indie.span}</p>
          <div className={styles.skills}>
            {indie.skills.map((s, i) => (
              <div key={i} className={styles.skill}>
                <SkillIcon skill={s} />
              </div>
            ))}
          </div>
          {indie.url && (
            <p className={styles.postDescription}>
              URL:{` `}
              <Link href={indie.url} target="_blank">
                {indie.url}
              </Link>
            </p>
          )}
        </div>
        <hr className="divider" />
        <section className={styles.content}>
          {blocks.map((block) => (
            <Block key={block.id} block={block} styles={styles} />
          ))}
          <div style={{ marginTop: '20px' }}>
            <Link href="/indie" className={styles.back}>
              ← List of Indie Works
            </Link>
          </div>
        </section>
      </article>
      <hr className="divider" />
      <Footer />
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = await getDatabase(indieDatabaseId)
  return {
    paths: database.map((page) => ({ params: { slug: getPageSlug(page) } })),
    fallback: false,
  }
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps<IndieProps> = async (context) => {
  const { slug } = context.params as IParams
  const database = (await getDatabase(indieDatabaseId)) as PageObjectResponse[]
  const page = database.find((page) => getPageSlug(page) === slug)
  const blocks = await getBlocks(page!.id)

  return {
    props: {
      indie: getIndieData(page!),
      blocks: blocks,
    },
  }
}
