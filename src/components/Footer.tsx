import Link from 'next/link'
import { GithubURL } from 'src/config'
import styles from 'src/styles/components/footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyRightZone}>
          <div className={styles.copyRight}>&copy; maru</div>
          <div>
            <Link href={`${GithubURL}/nolog-fb`} target="_blank">
              <i className="devicon-github-original" />
            </Link>
          </div>
        </div>
        <div>
          <p className={styles.createdBy}>Created by Notion API and Nextjs</p>
        </div>
      </div>
    </footer>
  )
}
