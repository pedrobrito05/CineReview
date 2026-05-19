import { useState } from "react";

function Profile(){
    const [activeTab, setActiveTab] = useState("reviews");

  // MOCK DATA
  // depois ligas isto à API
  const user = {
    name: "Daniel Costa",
    username: "danielc",
    avatar: null,
    stats: {
      watched: 128,
      reviews: 54,
      average: 8.4,
    },
  };

  const reviews = [
    {
      movie: "Blade Runner 2049",
      rating: 9,
      text: "Visualmente absurdo. Atmosfera perfeita e banda sonora incrível.",
    },
    {
      movie: "Se7en",
      rating: 10,
      text: "Um dos thrillers mais tensos e bem realizados de sempre.",
    },
  ];

  const watchedMovies = [
    "Interstellar",
    "The Batman",
    "Whiplash",
    "Dune",
    "Fight Club",
  ];

  const wishlistMovies = [
    "The Godfather",
    "Parasite",
    "Oldboy",
    "Memento",
  ];

  const renderInitial = () => {
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="profile-page">

      {/* HERO */}
      <section className="profile-hero">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            renderInitial()
          )}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-username">@{user.username}</p>
        </div>
      </section>

      {/* STATS */}
      <section className="profile-stats">
        <div className="profile-stat-card">
          <span className="profile-stat-number">
            {user.stats.watched}
          </span>
          <span className="profile-stat-label">
            Filmes Vistos
          </span>
        </div>

        <div className="profile-stat-card">
          <span className="profile-stat-number">
            {user.stats.reviews}
          </span>
          <span className="profile-stat-label">
            Reviews
          </span>
        </div>

        <div className="profile-stat-card">
          <span className="profile-stat-number">
            {user.stats.average}
          </span>
          <span className="profile-stat-label">
            Média de ratings
          </span>
        </div>
      </section>

      {/* TABS */}
      <section className="profile-tabs-wrapper">
        <div className="profile-tabs">
          <button
            className={`profile-tab ${
              activeTab === "reviews" ? "active" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={`profile-tab ${
              activeTab === "watched" ? "active" : ""
            }`}
            onClick={() => setActiveTab("watched")}
          >
            Filmes Vistos
          </button>

          <button
            className={`profile-tab ${
              activeTab === "wishlist" ? "active" : ""
            }`}
            onClick={() => setActiveTab("wishlist")}
          >
            Quero Ver
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <section className="profile-content">

        {activeTab === "reviews" && (
          <div className="profile-fade">
            <div className="profile-review-list">
              {reviews.map((review, index) => (
                <div className="profile-review-card" key={index}>
                  <div className="profile-review-top">
                    <h3>{review.movie}</h3>

                    <div className="profile-review-rating">
                      ★ {review.rating}
                    </div>
                  </div>

                  <p>{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "watched" && (
          <div className="profile-fade">
            <div className="profile-movie-grid">
              {watchedMovies.map((movie, index) => (
                <div className="profile-movie-card" key={index}>
                  <div className="profile-movie-poster">
                    🎬
                  </div>

                  <span>{movie}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="profile-fade">
            <div className="profile-movie-grid">
              {wishlistMovies.map((movie, index) => (
                <div className="profile-movie-card" key={index}>
                  <div className="profile-movie-poster wishlist">
                    ⭐
                  </div>

                  <span>{movie}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
export default Profile