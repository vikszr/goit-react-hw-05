import { useState, useEffect, Suspense } from "react";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import { getMovieDetails } from "../../api";
import styles from "./MovieDetailsPage.module.css";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const backLink = location.state?.from ?? "/movies";

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const movieData = await getMovieDetails(movieId);
        setMovie(movieData);
      } catch (error) {
        setError("Failed to fetch movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!movie) return null;

  const { title, release_date, vote_average, overview, genres, poster_path } =
    movie;
  const releaseYear = new Date(release_date).getFullYear();
  const userScore = Math.round(vote_average * 10);
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://via.placeholder.com/500x750";

  return (
    <div className={styles.container}>
      <Link to={backLink} className={styles.backLink}>
        ← Go back
      </Link>

      <div className={styles.movieInfo}>
        <img src={posterUrl} alt={title} className={styles.poster} />
        <div className={styles.details}>
          <h1>
            {title} ({releaseYear})
          </h1>
          <p>User Score: {userScore}%</p>
          <h2>Overview</h2>
          <p>{overview}</p>
          <h2>Genres</h2>
          <p>{genres.map((genre) => genre.name).join(", ")}</p>
        </div>
      </div>

      <div className={styles.additional}>
        <h2>Additional information</h2>
        <ul className={styles.additionalList}>
          <li>
            <Link to="cast" state={{ from: backLink }}>
              Cast
            </Link>
          </li>
          <li>
            <Link to="reviews" state={{ from: backLink }}>
              Reviews
            </Link>
          </li>
        </ul>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default MovieDetailsPage;
