import { useRef } from 'react'

const SWIPE_THRESHOLD = 50

export function useSwipe(onLeft: () => void, onRight: () => void) {
  // baslangic noktasi
  const startX = useRef<number | null>(null)

  return {
    // dokunma basladi
    onTouchStart: (e: React.TouchEvent) => {
      startX.current = e.touches[0]?.clientX ?? null
    },
    // dokunma bitti — yon hesapla
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current === null) return
      const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current
      startX.current = null
      if (Math.abs(dx) <= SWIPE_THRESHOLD) return
      if (dx < 0) onLeft()
      else onRight()
    },
  }
}
