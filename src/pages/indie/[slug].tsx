import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { SkillIcon } from 'src/components/SkillIcon'
import { indieDatabaseId } from 'src/config'
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

  console.log(indie)
  return (
    <div>
      <Head>
        <title>{indie.title}</title>
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>
          {indie.icon ? `${indie.icon} ` : ''}
          {indie.title}
        </h1>
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
        </div>
        <section>
          {blocks.map((block) => (
            <Block key={block.id} block={block} styles={styles} />
          ))}
          <div style={{ marginTop: '20px' }}>
            <Link href="/indie" className={styles.back}>
              ← Back to list of indie
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}

export const getStaticPaths = async () => {
  const database = (await getDatabase(indieDatabaseId)) as PageObjectResponse[]
  return {
    paths: database.map((page) => ({ params: { slug: getPageSlug(page) } })),
    // fallback: 'blocking',
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
