import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { getImageUrl } from '../services/tmdb'
import type { Movie, TVShow } from '../types/types'

interface MediaCardProps {
  item: Movie | TVShow
  type: 'movie' | 'tv'
}

function MediaCard({ item, type }: MediaCardProps) {
  const name = (item as Movie).title ?? (item as TVShow).name
  const year = ((item as Movie).release_date || (item as TVShow).first_air_date)?.slice(0, 4) ?? ''
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A'

  return (
    <Link to={`/${type}/${item.id}`} className="media-card">
      <div className="media-card__poster">
        <img src={getImageUrl(item.poster_path, 'w300')} alt={name} loading="lazy" />
        <span className="media-card__rating">
          <Star size={11} fill="currentColor" />
          {rating}
        </span>
      </div>
      <div className="media-card__info">
        <h4 className="media-card__name">{name}</h4>
        {year && <span className="media-card__year">{year}</span>}
      </div>
    </Link>
  )
}

export default memo(MediaCard)
