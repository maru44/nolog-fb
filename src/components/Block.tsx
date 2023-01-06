import Link from 'next/link'
import { Text } from 'src/components/Text'
import { blockWithChildren } from 'src/types/notion'

type BlockProps = {
  block: blockWithChildren
  styles: { readonly [key: string]: string }
}

export const Block = ({ block, styles }: BlockProps) => {
  const { type, id } = block

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text texts={block.paragraph.rich_text} styles={styles} />
        </p>
      )
    case 'heading_1':
      return (
        <h1>
          <Text texts={block.heading_1.rich_text} styles={styles} />
        </h1>
      )
    case 'heading_2':
      return (
        <h2>
          <Text texts={block.heading_2.rich_text} styles={styles} />
        </h2>
      )
    case 'heading_3':
      return (
        <h3>
          <Text texts={block.heading_3.rich_text} styles={styles} />
        </h3>
      )
    case 'bulleted_list_item':
      return (
        <li>
          <Text texts={block.bulleted_list_item.rich_text} styles={styles} />
        </li>
      )
    case 'numbered_list_item':
      return (
        <li>
          <Text texts={block.numbered_list_item.rich_text} styles={styles} />
        </li>
      )
    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={block.to_do.checked} /> <Text texts={block.to_do.rich_text} styles={styles} />
          </label>
        </div>
      )
    case 'toggle':
      return (
        <details>
          <summary>
            <Text texts={block.toggle.rich_text} styles={styles} />
          </summary>
          {/* {value.children?.map((block) => (
              <Fragment key={block.id}>{renderBlock(block)}</Fragment>
            ))} */}
        </details>
      )
    case 'child_page':
      return <p>{block.child_page.title}</p>
    case 'image':
      const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url
      const caption = block.image.caption ? block.image.caption[0]?.plain_text : ''
      return (
        <figure>
          <img src={src} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    case 'divider':
      return <hr key={id} />
    case 'quote':
      return <blockquote key={id}>{block.quote.rich_text[0].plain_text}</blockquote>
    case 'code':
      return (
        <pre className={styles.pre}>
          <code className={styles.code_block} key={id}>
            {block.code.rich_text[0].plain_text}
          </code>
        </pre>
      )
    case 'file':
      const src_file = block.file.type === 'external' ? block.file.external.url : block.file.file.url
      const splitSourceArray = src_file.split('/')
      const lastElementInArray = splitSourceArray[splitSourceArray.length - 1]
      const caption_file = block.file.caption ? block.file.caption[0]?.plain_text : ''
      return (
        <figure>
          <div className={styles.file}>
            📎{' '}
            <Link href={src_file} passHref>
              {lastElementInArray.split('?')[0]}
            </Link>
          </div>
          {caption_file && <figcaption>{caption_file}</figcaption>}
        </figure>
      )
    case 'bookmark':
      const href = block.bookmark.url
      return (
        <a href={href} target="_brank" className={styles.bookmark}>
          {href}
        </a>
      )
    case 'video':
      if (block.video.type === 'external') {
        return (
          <div className={styles.iframeWrapper}>
            <iframe src={block.video.external.url} />
          </div>
        )
      }
      return <iframe src={block.video.file.url} />
    //   return <iframe src=''></iframe>
    default:
      console.error(`❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`)
      return <></>
    //   return `❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`
  }
}

// const renderNestedList = (block) => {
//   const { type } = block
//   const value = block[type]
//   if (!value) return null

//   const isNumberedList = value.children[0].type === 'numbered_list_item'

//   if (isNumberedList) {
//     return <ol>{value.children.map((block) => renderBlock(block))}</ol>
//   }
//   return <ul>{value.children.map((block) => renderBlock(block))}</ul>
// }
