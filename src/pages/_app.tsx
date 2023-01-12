import type { AppProps } from 'next/app'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { usePageView } from 'src/src/hooks/usePageView'
import 'src/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  usePageView()
  return (
    <>
      <div className="container">
        {pageProps.page && <Header page={pageProps.page} />}
        <Component {...pageProps} />
      </div>
      <hr className="divider" />
      <Footer />
    </>
  )
}
