function MovieCard({ title, releaseDate, rating, image, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <img src={image} alt={title} />

      <h3>{title}</h3>

      <p>{releaseDate}</p>

      <p>⭐ {rating}</p>
    </div>
  );
}

export default MovieCard;