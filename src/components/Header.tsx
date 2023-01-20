import Link from 'next/link'
import { useMemo } from 'react'
import { HeaderMenu } from 'src/components/HeaderMenu'
import { GithubURL, kilroyPNG } from 'src/config'
import styles from 'src/styles/components/header.module.css'
import { ListPage, listPageInfo } from 'src/types/page'

type HeaderProps = {
  page: ListPage
}

export const Header = ({ page }: HeaderProps) => {
  const p = useMemo(() => listPageInfo.find((v) => v.key === page), [page])
  if (!p) return null

  return (
    <header className={styles.header}>
      <div className={styles.logos}>
        <img src={kilroyPNG} alt="top image" width="50%" />
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
      <HeaderMenu styles={styles} page={page} />
    </header>
  )
}
