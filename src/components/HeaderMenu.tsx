import Link from 'next/link'
import { ListPage, listPageInfo } from 'src/types/page'

type HeaderMenuProps = {
  page: ListPage
  styles: { readonly [key: string]: string }
}

export const HeaderMenu = ({ page, styles }: HeaderMenuProps) => {
  return (
    <div className={styles.menu}>
      {listPageInfo.map((p, i) => (
        <Link key={i} href={p.path} className={p.key === page ? styles.selected : undefined}>
          {p.key.charAt(0).toUpperCase() + p.key.slice(1)}
        </Link>
      ))}
    </div>
  )
}
