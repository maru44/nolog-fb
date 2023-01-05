// export type Blog = {
//   id: string
//   // properties: BlogProperties
//   properties: {
//     Name: {
//       title: blockWithChildren[]
//     }
//   }
// }

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
}
