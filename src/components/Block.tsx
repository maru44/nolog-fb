import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
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
      if (block.has_children && block.children) {
        return (
          <li>
            <Text texts={block.bulleted_list_item.rich_text} styles={styles} />
            <ul>{block.children && block.children.map((c, i) => <Block key={i} block={c} styles={styles} />)}</ul>
          </li>
        )
      }
      return (
        <li>
          <Text texts={block.bulleted_list_item.rich_text} styles={styles} />
        </li>
      )
    case 'numbered_list_item':
      if (block.has_children && block.children) {
        return (
          <li>
            <Text texts={block.numbered_list_item.rich_text} styles={styles} />
            <ol>{block.children && block.children.map((c, i) => <Block key={i} block={c} styles={styles} />)}</ol>
          </li>
        )
      }
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
          <>
            {block.children?.map((block) => (
              <Fragment key={block.id}>{<Block block={block} styles={styles} />}</Fragment>
            ))}
          </>
        </details>
      )
    case 'child_page':
      return <p>{block.child_page.title}</p>
    case 'image': {
      const src = block.image.type === 'external' ? block.image.external.url : block.image.file.url
      const caption = block.image.caption ? block.image.caption[0]?.plain_text : ''
      return (
        <figure>
          <Image src={src} alt={caption ?? src} width={0} height={0} sizes="100%" loading="lazy" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    }
    case 'divider':
      return <hr key={id} />
    case 'quote':
      return (
        <blockquote key={id}>
          <Text texts={block.quote.rich_text} styles={styles} />
        </blockquote>
      )
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
    case 'video': {
      const src = block.video.type === 'external' ? block.video.external.url : block.video.file.url
      return (
        <div className={styles.iframeWrapper}>
          <iframe src={src} title={src} />
        </div>
      )
    }
    default:
      console.error(`❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`)
      return <></>
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
