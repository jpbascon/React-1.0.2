import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../App.jsx';
import Spinner from './Spinner.jsx';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

const MovieDescription = () => {
  const { id } = useParams(); // Get the movie ID from the url
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(`Failed to fetch movie description: ${error}`);
      }
    }
    fetchMovieDetails();

  }, [id])


  return (
    <>
      {!movie ? <Spinner /> :
        <div className="movie-description">
          <div className="flex max-w-full">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-sm h-150"
            />
            <div className="movie-description-information">
              <div>
                <h1>{movie.title}</h1>
                <p className="flex gap-1">IMDB:
                  &nbsp;{movie.vote_average.toFixed(1)}
                  <img src="/star.svg" alt="Star" />
                </p>
                <p className="text-white mt-0">Upvoted: {movie.vote_count}</p>
                <p className="text-white font-normal">{movie.overview}</p>
              </div>
              <div>
                <p className="text-gray-100 text-lg font-normal">Language: {movie.original_language.toUpperCase()}</p>
                <p className="text-gray-100 text-lg font-normal mt-0">Release date: {movie.release_date}</p>
              </div>
            </div>
          </div>
        </div >
      }
    </>
  )
}

export default MovieDescription;