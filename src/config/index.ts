export const blogDatabaseId = process.env.BLOG_DATABASE_ID ?? ''
export const indieDatabaseId = process.env.INDIE_DATABASE_ID ?? ''
export const publicStorage = process.env.PUBLIC_STORAGE

export const getStorageURL = (name: string) => {
  if (name.startsWith('/')) return `${publicStorage}${name}`
  return `${publicStorage}/${name}`
}
