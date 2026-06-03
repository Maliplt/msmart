import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Spinner from './components/Spinner'

const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const PlayGamePage = lazy(() => import('./pages/PlayGamePage'))
const OverviewPage = lazy(() => import('./pages/OverviewPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const WorkInProgressPage = lazy(() => import('./pages/WorkInProgressPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const PackagesPage = lazy(() => import('./pages/PackagesPage'))

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/tv" element={<WorkInProgressPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/packages" element={<PackagesPage />} />
                        <Route path="/play/:gameId" element={<PlayGamePage />} />
                        <Route path="/work-in-progress" element={<WorkInProgressPage />} />
                        <Route path="/:type/:id" element={<OverviewPage />} />
                        <Route path="*" element={<WorkInProgressPage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default App
