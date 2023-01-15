import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { Block } from 'src/components/Block'
import { Chip } from 'src/components/Chip'
import { SkillIcon } from 'src/components/SkillIcon'
import { indieDatabaseId, kilroyPNG } from 'src/config'
import { getBlocks, getDatabase, getIndieData, getPageSlug } from 'src/lib/notion'
import styles from 'src/styles/indie.module.css'
import { Indie, indieTitle } from 'src/types/indie'
import { DetailPageProps } from 'src/types/page'

type IndieProps = DetailPageProps<Indie>

export default function IndieDetail({ data, blocks }: IndieProps) {
  if (!blocks) return <></>

  return (
    <div>
      <Head>
        <title>{data.title}</title>
        <meta property="og:title" content={data.title} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={data.excerpt} />
        <meta property="og:image" content={kilroyPNG} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.excerpt} />
        <meta name="twitter:image" content={kilroyPNG} />
      </Head>
      <article className={styles.container}>
        <h1 className={styles.name}>{indieTitle(data)}</h1>
        {data.status !== 'unknown' && (
          <div className={styles.chip}>
            <Chip value={data.status} status={data.status === 'active' ? 'success' : 'disabled'} />
          </div>
        )}
        <p className={styles.excerpt}>{data.excerpt}</p>
        <div>
          <p className={styles.postDescription}>{data.span}</p>
          <div className={styles.skills}>
            {data.skills.map((s, i) => (
              <div key={i} className={styles.skill}>
                <SkillIcon skill={s} />
              </div>
            ))}
          </div>
          {data.url && (
            <p className={styles.postDescription}>
              URL:{` `}
              <Link href={data.url} target="_blank">
                {data.url}
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

export const getStaticProps: GetStaticProps<IndieProps, IParams> = async (context) => {
  const { slug } = context.params!
  const database = (await getDatabase(indieDatabaseId)) as PageObjectResponse[]
  const page = database.find((page) => getPageSlug(page) === slug)
  const blocks = await getBlocks(page!.id)

  return {
    props: {
      data: getIndieData(page!),
      blocks: blocks,
    },
  }
}
