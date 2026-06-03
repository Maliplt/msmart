import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'rsuite'
import { Check, Zap, Crown, Play } from 'lucide-react'
import { animate } from 'animejs'
import Header from '../components/Header'
import Footer from '../components/Footer'
import type { PackageDef } from '../types/types'


const PACKAGES: PackageDef[] = [
  {
    id:      'free',
    name:    'Ücretsiz',
    price:   '₺0',
    period:  '',
    Icon:    Play,
    badge:   null,
    accent:  false,
    free:    true,
    features: [
      'SD Kalite (480p)',
      'Reklamlı İzleme',
      'Sınırlı Film & Dizi',
      '1 Cihaz',
      'Temel Oyunlar',
    ],
    cta: 'Ücretsiz Başla',
  },
  {
    id:      'standard',
    name:    'Standart',
    price:   '₺49',
    period:  '/ay',
    Icon:    Zap,
    badge:   'En Popüler',
    accent:  false,
    free:    false,
    features: [
      'Full HD Kalite (1080p)',
      'Reklamsız İzleme',
      'Tüm Film & Diziler',
      '2 Cihaz',
      'Tüm Oyunlar',
    ],
    cta: 'Başla',
  },
  {
    id:      'premium',
    name:    'Premium',
    price:   '₺79',
    period:  '/ay',
    Icon:    Crown,
    badge:   null,
    accent:  true,
    free:    false,
    features: [
      '4K Ultra HD',
      'Reklamsız İzleme',
      'Tüm İçerikler + Özel Yapımlar',
      '4 Cihaz + İndirme',
      'Öncelikli Destek',
    ],
    cta: 'Başla',
  },
]


export default function PackagesPage() {
  const navigate = useNavigate()
  const heroRef  = useRef<HTMLDivElement>(null)
  const gridRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heroRef.current)
      animate(heroRef.current, {
        opacity: [0, 1], translateY: [-20, 0],
        duration: 500, easing: 'easeOutQuart',
      })

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.package-card')
      animate(cards, {
        opacity: [0, 1], translateY: [32, 0],
        duration: 480, easing: 'easeOutQuart',
        delay: (_el: Element, i: number) => 160 + i * 100,
      })
    }
  }, [])

  const handleSelect = (pkg: PackageDef) => {
    navigate(pkg.free ? '/' : '/work-in-progress')
  }

  return (
    <div className="packages-page">
      <Header />
      <main className="packages-main">

        <div className="packages-hero" ref={heroRef} style={{ opacity: 0 }}>
          <span className="packages-badge">Planlar &amp; Fiyatlar</span>
          <h1>Sizin İçin En Uygun Plan</h1>
          <p>Ücretsiz başlayın, daha fazlası için istediğiniz zaman yükseltin.</p>
        </div>

        <div className="packages-grid" ref={gridRef}>
          {PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`package-card${pkg.accent ? ' package-card--accent' : ''}`}
              style={{ opacity: 0 }}
            >
              {pkg.badge && <span className="package-badge">{pkg.badge}</span>}

              <div className="package-card__header">
                <pkg.Icon
                  size={22}
                  className={pkg.accent ? 'pkg-icon-accent' : 'pkg-icon-default'}
                />
                <h3 className="package-name">{pkg.name}</h3>
              </div>

              <div className="package-price-row">
                <span className="package-price">{pkg.price}</span>
                {pkg.period && <span className="package-period">{pkg.period}</span>}
              </div>

              <ul className="package-features">
                {pkg.features.map(f => (
                  <li key={f}><Check size={14} />{f}</li>
                ))}
              </ul>

              <Button
                appearance={pkg.accent ? 'primary' : 'ghost'}
                className={`package-cta${pkg.accent ? ' pkg-cta-accent' : ''}`}
                onClick={() => handleSelect(pkg)}
                block
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  )
}
