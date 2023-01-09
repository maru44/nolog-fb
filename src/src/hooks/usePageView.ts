import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GA_TRACKING_ID } from 'src/config'
import { pageview } from 'src/lib/gtag'

export const usePageView = () => {
  const router = useRouter()
  useEffect(() => {
    if (!GA_TRACKING_ID) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRouteChange = (url: URL) => pageview(url)

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
}
