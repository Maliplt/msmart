import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import MediaPlayer from '../components/MediaPlayer'
import { getStreamSource } from '../services/player'
import { tmdbApi } from '../services/tmdb'

export default function PlayerPage() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [title, setTitle] = useState((location.state as { title?: string } | null)?.title ?? '')

  // baslik
  useEffect(() => {
    if (title || !type || !id) return
    const numId = Number(id)
    if (type === 'movie') tmdbApi.getMovieDetail(numId).then((d) => setTitle(d.title)).catch(() => {})
    else if (type === 'tv') tmdbApi.getTVShowDetail(numId).then((d) => setTitle(d.name)).catch(() => {})
  }, [type, id, title])

  return (
    <div className="player-page">
      <MediaPlayer
        src={getStreamSource(type, id)}
        title={title}
        onBack={() => navigate(-1)}
      />
    </div>
  )
}
