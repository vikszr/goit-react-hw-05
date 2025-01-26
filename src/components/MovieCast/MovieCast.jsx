import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieCredits } from "../../api";
import styles from "./MovieCast.module.css";

const MovieCast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        setIsLoading(true);
        const { cast } = await getMovieCredits(movieId);
        setCast(cast);
      } catch (error) {
        setError("Failed to fetch cast information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCast();
  }, [movieId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (cast.length === 0) return <div>No cast information available</div>;

  return (
    <ul className={styles.cast}>
      {cast.map(({ id, profile_path, name, character }) => (
        <li key={id} className={styles.castItem}>
          <img
            src={
              profile_path
                ? `https://image.tmdb.org/t/p/w200${profile_path}`
                : "https://via.placeholder.com/200x300"
            }
            alt={name}
            className={styles.castImage}
          />
          <div className={styles.castInfo}>
            <p className={styles.name}>{name}</p>
            <p className={styles.character}>Character: {character}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieCast;
