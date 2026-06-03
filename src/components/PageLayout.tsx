import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import Spinner from './Spinner'

interface PageLayoutProps {
  children?: ReactNode
  mainClassName?: string
  className?: string
  loading?: boolean
}

export default function PageLayout({
  children,
  mainClassName,
  className,
  loading = false,
}: PageLayoutProps) {
  return (
    <div className={className}>
      {loading && <Spinner />}
      <Header />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  )
}
