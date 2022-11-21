import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'react-hot-toast'

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
