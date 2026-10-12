import "./App.css";
import Navbar from "./Navbar.jsx";
import MovieCard from "./MovieCard.jsx";
import { useEffect, useState } from "react";
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  18: "Drama",
  27: "Horror",
  10749: "Romance",
  878: "Science Fiction",
  53: "Thriller"
};
const languageMap = {
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  te: "Telugu",
  fr: "French",
  es: "Spanish",
  zh: "Chinese"
};

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  function handleSearch(newSearch) {
    setSearch(newSearch);
  }

  // Search Movies Effect
  useEffect(() => {
    if (search === "") {
      return;
    }

    async function searchMovies() {
      setLoading(true);
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${search}`
      );
      const data = await response.json();
      setMovies(data.results);
      setLoading(false);
    }

    searchMovies();
  }, [search]);

  // Fetch Trending Movies on Initial Load
  useEffect(() => {
    async function fetchMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      );
      const data = await response.json();
      setMovies(data.results);
    }

    fetchMovies();
  }, []);

  // Sync Favorites with LocalStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <Navbar onSearch={handleSearch} />
      <h1>Cinetrack</h1>
      <p>Discover your next favorite movie</p>

      <div className="movie-grid">
        {loading ? (
          <p>Loading movies... 🎬</p>
        ) : filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              releaseDate={movie.release_date}
              rating={movie.vote_average}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              onClick={() => setSelectedMovie(movie)}
            />
          ))
        ) : (
          <p>No movies found 🎬</p>
        )}
      </div>

      {selectedMovie && (
        <div className="movie-details">
          <img
            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
            alt={selectedMovie.title}
          />
          <div>
            <h2>{selectedMovie.title}</h2>
            <p>⭐ {selectedMovie.vote_average}</p>
            <p>📅 {selectedMovie.release_date?.slice(0, 4) || "Unknown"}</p>
            <p>
              🌎 Language:{" "}
              {languageMap[selectedMovie.original_language] ||
                selectedMovie.original_language?.toUpperCase() ||
                "Unknown"}
            </p>
            <p>
                🎭 Genres:{" "}
                {selectedMovie.genre_ids
                  ?.map((id) => genreMap[id] || "Other")
                  .join(", ") || "Not available"}
            </p>
            <p>{selectedMovie.overview}</p>
            <button
              onClick={() => {
                if (!favorites.some((movie) => movie.id === selectedMovie.id)) {
                  setFavorites([...favorites, selectedMovie]);
                }
              }}
            >
              ♡ Add to Favorites
            </button>
            <button onClick={() => setSelectedMovie(null)}>✕ Close</button>
          </div>
        </div>
      )}

      <h2>⭐ Favorites</h2>
      {favorites.map((movie) => (
        <div key={movie.id}>
          <p>{movie.title}</p>
          <button
            onClick={() => {
              setFavorites(
                favorites.filter((favorite) => favorite.id !== movie.id)
              );
            }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;