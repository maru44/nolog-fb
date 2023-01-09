import type { AppProps } from 'next/app'
import { usePageView } from 'src/src/hooks/usePageView'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  usePageView()
  return <Component {...pageProps} />
}
