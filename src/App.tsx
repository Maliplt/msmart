import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Spinner from './components/Spinner'
import RootLayout from './components/RootLayout'

const HomePage = lazy(() => import('./pages/HomePage'))
const ExplorePage = lazy(() => import('./pages/ExplorePage'))
const PlayGamePage = lazy(() => import('./pages/PlayGamePage'))
const OverviewPage = lazy(() => import('./pages/OverviewPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const WorkInProgressPage = lazy(() => import('./pages/WorkInProgressPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const PackagesPage = lazy(() => import('./pages/PackagesPage'))
const PlayerPage = lazy(() => import('./pages/PlayerPage'))
const TvPage = lazy(() => import('./pages/TvPage'))

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <Suspense fallback={<Spinner />}>
                    <Routes>
                        {/* kalici header/footer kabugu */}
                        <Route element={<RootLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/explore" element={<ExplorePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/packages" element={<PackagesPage />} />
                            <Route path="/tv" element={<TvPage />} />
                            <Route path="/work-in-progress" element={<WorkInProgressPage />} />
                            <Route path="/:type/:id" element={<OverviewPage />} />
                            <Route path="*" element={<WorkInProgressPage />} />
                        </Route>

                        {/* tam ekran / bagimsiz sayfalar */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/play/:gameId" element={<PlayGamePage />} />
                        <Route path="/:type/:id/player" element={<PlayerPage />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </BrowserRouter>
    )
}

export default App
