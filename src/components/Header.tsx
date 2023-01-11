import Link from 'next/link'
import { useMemo } from 'react'
import { getStorageURL, GithubURL } from 'src/config'
import styles from 'src/styles/components/header.module.css'
import { ListPage } from 'src/types/page'

type PathWithDesc = {
  path: string
  name: string
  desc: string
}

type HeaderProps = {
  page?: ListPage
}

const pages: { [key in ListPage]: PathWithDesc } = {
  home: {
    path: '/',
    name: 'Blog',
    desc: 'A libertarian. An web engineer.',
  },
  indie: {
    path: '/indie',
    name: 'Indie',
    desc: 'Indie Works',
  },
  anime: {
    path: '/anime',
    name: 'Anime',
    desc: 'Just my personal opinion',
  },
}

const pathWithDesc = (page?: ListPage) => {
  if (!page) return
  return pages[page]
}

export const Header = ({ page }: HeaderProps) => {
  const p = useMemo(() => pathWithDesc(page), [page])
  const links = useMemo(() => Links(page), [page])
  if (!p) return null

  return (
    <header className={styles.header}>
      <div className={styles.logos}>
        <img src={getStorageURL('kilroy.jpg')} width="50%" />
      </div>
      <h1>Maru</h1>
      <p>{p.desc}</p>
      <div className={styles.accounts}>
        <div>
          <Link href={GithubURL} target="_blank">
            <i className="devicon-github-original" />
          </Link>
        </div>
      </div>
      <div className={styles.menu}>{links}</div>
    </header>
  )
}

const Links = (page?: ListPage) => {
  if (!page) return

  return Object.entries(pages).map(([k, v]) => {
    return (
      <Link key={k} href={v.path} className={k === page ? styles.selected : undefined}>
        {v.name}
      </Link>
    )
  })
}
