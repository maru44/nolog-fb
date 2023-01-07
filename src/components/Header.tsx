import Link from 'next/link'
import { getStorageURL, GithubURL } from 'src/config'
import styles from 'src/styles/components/header.module.css'

type CurrentPage = 'home' | 'indie'

type HeaderProps = {
  current?: CurrentPage
}

export const Header = ({ current = 'home' }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logos}>
        <img src={getStorageURL('kilroy.jpg')} width="50%" />
      </div>
      <h1>Maru</h1>
      <p>
        {current === 'home' && 'A libertarian. An web engineer.'}
        {current === 'indie' && 'Indie Works'}
      </p>
      <div className={styles.accounts}>
        <div>
          <Link href={GithubURL} target="_blank">
            <i className="devicon-github-original" />
          </Link>
        </div>
      </div>
      <div className={styles.menu}>
        <Link href="/" className={current === 'home' ? styles.selected : undefined}>
          Blog
        </Link>
        <Link href="/indie" className={current === 'indie' ? styles.selected : undefined}>
          Indie Dev
        </Link>
      </div>
    </header>
  )
}
