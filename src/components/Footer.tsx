import styles from 'src/styles/components/footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>&copy; maru</div>
        <div>
          <p className={styles.createdBy}>Created by Notion API and Nextjs</p>
        </div>
      </div>
    </footer>
  )
}
