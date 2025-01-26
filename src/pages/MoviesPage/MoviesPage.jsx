import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../../api";
import MovieList from "../../components/MovieList/MovieList";
import styles from "./MoviesPage.module.css";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const { results } = await searchMovies(query);
        setMovies(results);
        if (results.length === 0) {
          setError("No movies found");
        }
      } catch (error) {
        setError("Failed to fetch movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const searchQuery = form.elements.query.value;

    if (searchQuery.trim() === "") {
      setError("Please enter a search query");
      return;
    }

    setSearchParams({ query: searchQuery });
    setError(null);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="query"
          defaultValue={query}
          className={styles.input}
          placeholder="Search movies..."
        />
        <button type="submit" className={styles.button}>
          Search
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {movies.length > 0 && <MovieList movies={movies} />}
    </div>
  );
};

export default MoviesPage;
