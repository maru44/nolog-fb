import { GA_TRACKING_ID } from 'src/config'

declare global {
  interface Window {
    gtag: Gtag.Gtag
  }
}

export const pageview = (url: URL): void => {
  if (window && window.gtag) {
    window.gtag('config', GA_TRACKING_ID ?? '', {
      page_path: url,
    })
  }
}

type GaEventProps = {
  action: string
  category: string
  label: string
  value?: number
}

export const event = ({ action, category, label, value }: GaEventProps): void => {
  if (!GA_TRACKING_ID) {
    return
  }

  window.gtag('event', action, {
    event_category: category,
    event_lavel: JSON.stringify(label),
    value,
  })
}
