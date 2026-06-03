import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from 'rsuite'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="app-error-boundary">
        <h1>Bir şeyler ters gitti</h1>
        <p>Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.</p>
        <Button appearance="primary" className="btn-play" size="lg" onClick={this.handleReload}>
          Sayfayı Yenile
        </Button>
      </div>
    )
  }
}
