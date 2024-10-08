export const blogDatabaseId = process.env.BLOG_DATABASE_ID ?? ''
export const indieDatabaseId = process.env.INDIE_DATABASE_ID ?? ''
export const animeDatabaseId = process.env.ANIME_DATABASE_ID ?? ''
export const publicStorage = process.env.NEXT_PUBLIC_PUBLIC_STORAGE
export const ENV = process.env.NODE_ENV
export const GA_TRACKING_ID = ENV === 'production' ? process.env.NEXT_PUBLIC_GA_ID : undefined

export const getStorageURL = (name: string) => {
  if (name.startsWith('/')) return `${publicStorage}${name}`
  return `${publicStorage}/${name}`
}

export const kilroyPNG = getStorageURL('kilroy.jpg')
export const shiroJPG = getStorageURL('shiro_illust.jpg')
export const shiroJPGFlat = getStorageURL('shiro_illust_flat.jpg')

export const GithubURL = `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_ACCOUNT}`

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
