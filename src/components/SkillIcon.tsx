import styles from 'src/styles/components/skillicon.module.css'

type SkillIconProps = {
  skill: string
}

export const SkillIcon = ({ skill }: SkillIconProps) => {
  let icon: JSX.Element | undefined = undefined
  switch (skill) {
    case 'GCP':
      icon = <img src="/icons/google-cloud-platform.svg" width="30px" />
      break
    case 'go':
      icon = <i className="devicon-go-original-wordmark" style={{ fontSize: '30px' }} />
      break
    case 'React':
      icon = <i className="devicon-react-original" style={{ fontSize: '30px' }} />
      break
    case 'Firebase':
      icon = <i className="devicon-firebase-plain" />
      break
    case 'Terraform':
      icon = <i className="devicon-terraform-plain" />
      break
    case 'TypeScript':
      icon = <i className="devicon-typescript-plain" />
      break
    case 'docker':
      icon = <i className="devicon-docker-plain" />
      break
    case 'AWS':
      icon = <img src="/icons/aws.svg" width="30px" />
      break
    case 'PostgreSQL':
      icon = <i className="devicon-postgresql-plain" />
      break
    case 'MySQL':
      icon = <i className="devicon-mysql-plain" />
      break
    case 'Nextjs':
      icon = <i className="devicon-nextjs-original" />
      break
    case 'Django':
      icon = <i className="devicon-django-plain" />
      break
    case 'threejs':
      icon = <i className="devicon-threejs-original" />
      break
    case 'jquery':
      icon = <i className="devicon-jquery-plain" />
      break
    case 'heroku':
      icon = <i className="devicon-heroku-original" />
      break
    case 'sqlite':
      icon = <i className="devicon-sqlite-plain" />
      break
    case 'blender':
      icon = <i className="devicon-blender-original" />
      break
  }
  if (!!icon) {
    return (
      <span className={styles.tooltip}>
        {icon}
        <span className={styles.tooltipText}>{skill}</span>
      </span>
    )
  }
  return <span>{skill}</span>
}
