import { useState, useEffect } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import MovieDescription from './components/MovieDescription';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const API_BASE_URL = 'https://api.themoviedb.org/3'; // API this software is trying to communicate with

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Contains the API Key

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', // What kind of data this software will be accepting
    Authorization: `Bearer ${API_KEY}` // Whos trying to request data 
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search bar
  const [errorMessage, setErrorMessage] = useState(''); // State for response if it's false
  const [movieList, setMovieList] = useState([]); // State for movie data
  const [trendingMovies, setTrendingMovies] = useState([]); // State for trending movies
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


  // Debounce the search term to preveng making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    loadTrendingMovies();
  }, [])

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  console.log(movieList);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <div className="pattern" />
                <div className="wrapper">
                  <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> {/* Sends state to the component Search */}
                  </header>
                  {trendingMovies.length > 0 && (
                    <section className="trending">
                      <h2>Trending Movies</h2>
                      <ul>
                        {trendingMovies.map((movie, index) => (
                          <li key={movie.$id}>
                            <p>{index + 1}</p>
                            <img src={movie.poster_url} alt={movie.title} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  <section className="all-movies">
                    <h2>All Movies</h2>
                    {isLoading ? (
                      <Spinner /> // Proceed to display loading if it's true.
                    ) : errorMessage ? (
                      <p className="text-red-500">{errorMessage}</p> // Displays loading is false and errorMessage has a truthy value
                    ) : (
                      <ul>
                        {movieList.map((movie) => (
                          <MovieCard key={movie.id} movie={movie} /> // Shows when isLoading is false AND errorMessage is falsy
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </main>
            }
          />
          <Route path="/movie/:id" element={<MovieDescription />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
