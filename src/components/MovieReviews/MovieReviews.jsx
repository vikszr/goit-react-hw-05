import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMovieReviews } from "../../api";
import styles from "./MovieReviews.module.css";

const MovieReviews = () => {
  const { movieId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const { results } = await getMovieReviews(movieId);
        setReviews(results);
      } catch (error) {
        setError("Failed to fetch reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (reviews.length === 0) return <div>No reviews available</div>;

  return (
    <ul className={styles.reviews}>
      {reviews.map(({ id, author, content }) => (
        <li key={id} className={styles.reviewItem}>
          <h3 className={styles.author}>Author: {author}</h3>
          <p className={styles.content}>{content}</p>
        </li>
      ))}
    </ul>
  );
};

export default MovieReviews;
