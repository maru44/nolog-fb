import Link from 'next/link'
import styles from 'src/styles/components/header.module.css'

type CurrentPage = 'home' | 'indie'

type HeaderProps = {
  current?: CurrentPage
}

export const Header = ({ current = 'home' }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logos}>
        <img src="/kilroy.jpg" width="50%" />
      </div>
      <h1>Maru</h1>
      <p>
        {current === 'home' && 'A libertarian. An web engineer.'}
        {current === 'indie' && 'Indie Works'}
        {/* This is an example of a Next.js blog with data fetched with Notions API. The data comes from{' '}
      <a href={`https://www.notion.so/${databaseId}`}>this table</a>. Get the source code on{' '}
      <a href="https://github.com/samuelkraft/notion-blog-nextjs">Github</a> or read{' '}
      <a href="https://samuelkraft.com/blog/building-a-notion-blog-with-public-api">my blogpost</a> on building your own. */}
      </p>
      <div className={styles.menu}>
        <Link href="/" className={current === 'home' ? styles.selected : undefined}>
          Home
        </Link>
        <Link href="/indie" className={current === 'indie' ? styles.selected : undefined}>
          Indie Dev
        </Link>
      </div>
    </header>
  )
}
