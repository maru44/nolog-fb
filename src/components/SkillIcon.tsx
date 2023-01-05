type SkillIconProps = {
  skill: string
}

export const SkillIcon = ({ skill }: SkillIconProps) => {
  switch (skill) {
    case 'GCP':
      //   return <i className="devicon-googlecloud-plain-wordmark" style={{ fontSize: '50px' }} />
      // return <svg></svg>
      //   return <GoIcon />
      return <img src="icons/go.svg" />
    case 'go':
      return <i className="devicon-go-original-wordmark" />
    case 'React':
      return <i className="devicon-react-original" />
    case 'Firebase':
      return <i className="devicon-firebase-plain" />
    case 'Terraform':
      return <i className="devicon-terraform-plain" />
    case 'TypeScript':
      return <i className="devicon-typescript-plain" />
  }
  return <span>{skill}</span>
}
