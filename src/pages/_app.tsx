import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Footer } from 'src/components/Footer'
import { Header } from 'src/components/Header'
import { usePageView } from 'src/hooks/usePageView'
import 'src/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  usePageView()
  return (
    <>
      <Head>
        <link rel="canonical" href="https://maru44.web.app" />
        <link rel="shortcut icon" type="image/jpg" href="/shiro_illust_sq.jpg" />
      </Head>
      <div className="container">
        {pageProps.page && <Header page={pageProps.page} />}
        <Component {...pageProps} />
      </div>
      <hr className="divider" />
      <Footer />
    </>
  )
}
