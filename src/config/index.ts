export const blogDatabaseId = process.env.BLOG_DATABASE_ID ?? ''
export const indieDatabaseId = process.env.INDIE_DATABASE_ID ?? ''
export const animeDatabaseId = process.env.ANIME_DATABASE_ID ?? ''
export const publicStorage = process.env.NEXT_PUBLIC_PUBLIC_STORAGE

export const getStorageURL = (name: string) => {
  if (name.startsWith('/')) return `${publicStorage}${name}`
  return `${publicStorage}/${name}`
}

export const GithubURL = `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ACCOUNT}`
