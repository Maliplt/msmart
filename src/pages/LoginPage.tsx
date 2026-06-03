import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Button, Schema } from 'rsuite'
import { Eye, EyeOff } from 'lucide-react'
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
  const panelRef = useRef<HTMLDivElement>(null)

  const [movies,    setMovies]    = useState<Movie[]>([])
  const [bgIdx,     setBgIdx]     = useState(0)
  const [formValue, setFormValue] = useState({ email: '', password: '' })
  const [errors,    setErrors]    = useState<Record<string, string>>({})
  const [showPw,    setShowPw]    = useState(false)


  useEffect(() => {
    if (panelRef.current)
      animate(panelRef.current, {
        opacity: [0, 1], translateX: [40, 0],
        duration: 600, easing: 'easeOutQuart',
      })
  }, [])


  useEffect(() => {
    tmdbApi.getPopularMovies()
      .then(res => {
        setMovies(res.results.filter(m => m.backdrop_path && m.overview).slice(0, 8))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (movies.length <= 1) return
    const id = setInterval(() => setBgIdx(i => (i + 1) % movies.length), 5000)
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

  const setField = (key: keyof typeof formValue) => (val: string) => {
    setFormValue(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  return (
    <div className="login-page">
      <Header />


      {movies.map((m, i) => (
        <img
          key={m.id}
          className={`login-bg${i === bgIdx ? ' active' : ''}`}
          src={getImageUrl(m.backdrop_path, 'original')}
          alt=""
          aria-hidden="true"
        />
      ))}
      <div className="login-bg-overlay" />


      <div className="login-panels">


        <div className="login-left">
          {currentMovie && (
            <div className="login-left__info">
              <span className="login-left__badge">Günün Filmi</span>
              <h2>{currentMovie.title}</h2>
              <p>{currentMovie.overview}</p>
            </div>
          )}
        </div>


        <div className="login-right" ref={panelRef} style={{ opacity: 0 }}>
          <div className="login-card">
            <h2 className="login-heading">Giriş Yap</h2>
            <p className="login-subheading">
              Hesabınıza giriş yapın ve izlemeye devam edin.
            </p>

            <div className="login-form">
              <div className="login-field">
                <label className="login-label">E-posta</label>
                <Input
                  type="email"
                  placeholder="ornek@mail.com"
                  autoComplete="email"
                  value={formValue.email}
                  onChange={setField('email')}
                  className={errors.email ? 'login-input-error' : ''}
                />
                {errors.email && <span className="login-field-err">{errors.email}</span>}
              </div>

              <div className="login-field">
                <label className="login-label">Şifre</label>
                <div className="login-input-wrap">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={formValue.password}
                    onChange={setField('password')}
                    className={errors.password ? 'login-input-error' : ''}
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw(p => !p)}
                    aria-label={showPw ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="login-field-err">{errors.password}</span>}
              </div>
            </div>


            <div className="login-actions">
              <Button
                appearance="primary"
                className="login-submit-btn"
                onClick={handleLogin}
                block
              >
                Giriş Yap
              </Button>
              <Button
                appearance="subtle"
                className="login-register-btn"
                onClick={() => navigate('/packages')}
                block
              >
                Üye Olmak İstiyorum
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
