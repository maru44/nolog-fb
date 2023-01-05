// export type Blog = {
//   id: string
//   // properties: BlogProperties
//   properties: {
//     Name: {
//       title: blockWithChildren[]
//     }
//   }
// }

export type Blog = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  published: boolean
}
