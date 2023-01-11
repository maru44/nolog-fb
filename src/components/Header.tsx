import Link from 'next/link'
import { getStorageURL, GithubURL } from 'src/config'
import styles from 'src/styles/components/header.module.css'
import { ListPage } from 'src/types/page'

type PageWithPath = {
  page: ListPage
  path?: string
}

type HeaderProps = {
  page?: ListPage
}

export const Header = ({ page }: HeaderProps) => {
  if (!page) return null
  return (
    <header className={styles.header}>
      <div className={styles.logos}>
        <img src={getStorageURL('kilroy.jpg')} width="50%" />
      </div>
      <h1>Maru</h1>
      <p>
        {page === 'home' && 'A libertarian. An web engineer.'}
        {page === 'indie' && 'Indie Works'}
        {page === 'anime' && 'Just my personal opinion'}
      </p>
      <div className={styles.accounts}>
        <div>
          <Link href={GithubURL} target="_blank">
            <i className="devicon-github-original" />
          </Link>
        </div>
      </div>
      <div className={styles.menu}>
        <Link href="/" className={page === 'home' ? styles.selected : undefined}>
          Blog
        </Link>
        <Link href="/indie" className={page === 'indie' ? styles.selected : undefined}>
          Indie
        </Link>
        <Link href="/anime" className={page === 'anime' ? styles.selected : undefined}>
          Anime
        </Link>
      </div>
    </header>
  )
}
