import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const URL_USER = `http://localhost:8000/api/user/${id}/`;
  const URL_REVIEWS = `http://localhost:8000/api/reviewsDeUser/${id}/`;

  const [activeTab, setActiveTab] = useState("reviews");
  const [user2, setUser2] = useState(null);
  const [reviewsDeUser, setReviewsDeUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reviewsRes] = await Promise.all([
          axios.get(URL_USER),
          axios.get(URL_REVIEWS),
        ]);

        setUser2(userRes.data);
        setReviewsDeUser(reviewsRes.data);
      } catch (err) {
        console.log(err);
        setUser2(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("imagem", file);

    try {
      const res = await axios.put(URL_USER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": getCSRFToken(),
        },
        withCredentials: true,
      });

      setUser2(res.data);
    } catch (err) {
      console.log("Erro upload avatar:", err);
    }
  };

  // LOADING / ERROR STATES
  if (loading) return <div>Loading...</div>;
  if (!user2) return <div>Utilizador não encontrado</div>;

  return (
    <div className="profile-page">

      {/* HERO */}
      <section className="profile-hero">

        <div className="profile-avatar" onClick={handleAvatarClick}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />

          <img
            src={
              preview
                ? preview
                : `http://localhost:8000${user2.imagem}`
            }
            alt={user2.user?.username}
          />

          <div className="avatar-overlay">
            Alterar foto
          </div>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            {user2.user?.username}
          </h1>

          <p className="profile-username">
            @{user2.user?.username}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="profile-stats">
        <div className="profile-stat-card">
          <span>{user2?.visto?.length || 0}</span>
          <p>Filmes Vistos</p>
        </div>

        <div className="profile-stat-card">
          <span>{reviewsDeUser?.length || 0}</span>
          <p>Reviews</p>
        </div>

        <div className="profile-stat-card">
          <span>0</span>
          <p>Média de ratings</p>
        </div>
      </section>

      {/* TABS */}
      <section className="profile-tabs-wrapper">
        <div className="profile-tabs">

          <button
            className={`profile-tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={`profile-tab ${activeTab === "watched" ? "active" : ""}`}
            onClick={() => setActiveTab("watched")}
          >
            Filmes Vistos
          </button>

        </div>
      </section>

      {/* CONTENT */}
      <section className="profile-content">

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="profile-review-list">

            {reviewsDeUser?.map((review) => (
              <div className="profile-review-card" key={review.id}>
                <h3>{review.filme.titulo}</h3>
                <span>★ {review.avaliacao}</span>
                <p>{review.texto}</p>
              </div>
            ))}

          </div>
        )}

        {/* WATCHED */}
        {activeTab === "watched" && (
          <div className="grid">

            {user2?.visto?.map((filme) => (
              <div
                className="card"
                key={filme.id}
                onClick={() => navigate(`/filme/${filme.id}/`)}
              >

                <div className="poster">
                  <img
                    src={`http://localhost:8000${filme.imagem}`}
                    alt={filme.titulo}
                  />

                  <div className="views-badge">
                    {filme.views || 0}
                  </div>

                  <div className="badge">
                    {filme.rating || "0.0"}
                  </div>

                  <span className="genre-tag">
                    {filme.genero}
                  </span>
                </div>

                <div className="card-title">
                  {filme.titulo}
                </div>

                <div className="card-meta">
                  {filme.lancamento}
                </div>

                <div className="card-director">
                  {filme.diretor?.map(d => d.nome).join(", ")}
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Profile;