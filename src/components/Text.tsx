import { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'

type TextProps = {
  texts: RichTextItemResponse[]
  styles: { readonly [key: string]: string }
}

export const Text = ({ texts, styles }: TextProps) => {
  if (!texts) {
    return null
  }
  const elements = texts.map((value, i) => {
    switch (value.type) {
      case 'equation':
      case 'mention':
        break
      case 'text': {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          text,
        } = value
        return (
          <span
            className={[
              bold ? styles.bold : '',
              code ? styles.code : '',
              italic ? styles.italic : '',
              strikethrough ? styles.strikethrough : '',
              underline ? styles.underline : '',
            ].join(' ')}
            style={color !== 'default' ? { color } : {}}
            key={i}
          >
            {text.link ? (
              <a href={text.link.url} target="_blank" rel="noopener noreferrer">
                {text.content}
              </a>
            ) : (
              text.content
            )}
          </span>
        )
      }
    }
    return null
  })
  return <>{elements}</>
}
