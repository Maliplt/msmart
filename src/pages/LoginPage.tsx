import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Schema } from 'rsuite'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { animate } from 'animejs'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { tmdbApi, getImageUrl } from '../services/tmdb'
import type { Movie } from '../types/types'

const { StringType } = Schema.Types

const loginModel = Schema.Model({
  email: StringType()
    .isEmail('Geçerli bir e-posta adresi girin.')
    .isRequired('E-posta zorunludur.'),
  password: StringType()
    .minLength(8, 'Şifre en az 8 karakter olmalı.')
    .isRequired('Şifre zorunludur.'),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)

  const [movies, setMovies] = useState<Movie[]>([])
  const [bgIdx, setBgIdx] = useState(0)
  const [formValue, setFormValue] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (cardRef.current)
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [28, 0],
        duration: 600,
        easing: 'easeOutQuart',
      })
  }, [])

  useEffect(() => {
    tmdbApi.getPopularMovies()
      .then((res) => {
        setMovies(res.results.filter((m) => m.backdrop_path && m.overview).slice(0, 8))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (movies.length <= 1) return
    const id = setInterval(() => setBgIdx((i) => (i + 1) % movies.length), 5000)
    return () => clearInterval(id)
  }, [movies.length])

  const currentMovie = movies[bgIdx] ?? null

  const handleLogin = () => {
    const result = loginModel.check(formValue) as Record<string, { hasError: boolean; errorMessage: string }>
    const errs: Record<string, string> = {}
    Object.entries(result).forEach(([k, v]) => { if (v.hasError) errs[k] = v.errorMessage })
    setErrors(errs)
    if (Object.keys(errs).length) return
    navigate('/')
  }

  const setField = (key: keyof typeof formValue) => (value: string) => {
    setFormValue((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  return (
    <div className="login-page">
      <Header />

      {movies.map((m, i) => (
        <img
          key={m.id}
          className={`login-bg ${i === bgIdx ? 'login-bg--active' : ''}`}
          src={getImageUrl(m.backdrop_path, 'original')}
          alt=""
          aria-hidden="true"
        />
      ))}
      <div className="login-bg__overlay" />

      <div className="login-body">
        <div className="login-intro">
          {currentMovie && (
            <div className="login-intro__inner">
              <span className="login-intro__badge">Günün Filmi</span>
              <h2 className="login-intro__title">{currentMovie.title}</h2>
              <p className="login-intro__desc">{currentMovie.overview}</p>
            </div>
          )}
        </div>

        <div className="login-formwrap">
          <div className="login-card" ref={cardRef}>
            <div className="login-card__head">
              <h1 className="login-card__title">Giriş Yap</h1>
              <p className="login-card__subtitle">Hesabınıza giriş yapın ve izlemeye devam edin.</p>
            </div>

            <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
              <div className="login-field">
                <label className="login-field__label" htmlFor="login-email">E-posta</label>
                <div className="login-field__control">
                  <input
                    id="login-email"
                    type="email"
                    className={`login-input ${errors.email ? 'login-input--error' : ''}`}
                    placeholder="ornek@mail.com"
                    autoComplete="email"
                    value={formValue.email}
                    onChange={(e) => setField('email')(e.target.value)}
                  />
                </div>
                {errors.email && (
                  <span className="login-field__error">
                    <AlertCircle size={13} /> {errors.email}
                  </span>
                )}
              </div>

              <div className="login-field">
                <label className="login-field__label" htmlFor="login-password">Şifre</label>
                <div className="login-field__control">
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    className={`login-input login-input--padded ${errors.password ? 'login-input--error' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formValue.password}
                    onChange={(e) => setField('password')(e.target.value)}
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="login-field__error">
                    <AlertCircle size={13} /> {errors.password}
                  </span>
                )}
              </div>

              <div className="login-actions">
                <button type="submit" className="login-btn login-btn--primary">Giriş Yap</button>
                <button
                  type="button"
                  className="login-btn login-btn--ghost"
                  onClick={() => navigate('/packages')}
                >
                  Üye Olmak İstiyorum
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
