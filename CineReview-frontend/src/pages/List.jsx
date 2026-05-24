import '../styles.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TmdbModal from "../components/TmdbModal.jsx";

const apiAxios = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function List({ user, refreshFilmes }) {
  const navigate = useNavigate();

  const [FilmesList, setFilmesList] = useState([]);
  const [showTmdb, setShowTmdb] = useState(false);

  const getFilmes = () => {
    apiAxios
      .get("/api/filmes/")
      .then(res => setFilmesList(res.data));
  };

  const handleApagarFilme = (e, filmeId) => {
    e.stopPropagation();
    if (!window.confirm('Tens a certeza que queres apagar este filme?')) return;
    const csrfToken = getCookie("csrftoken");
    apiAxios.delete(`/api/filmes/${filmeId}/apagar/`, {
        headers: { "X-CSRFToken": csrfToken }
    })
    .then(() => getFilmes())
    .catch((err) => console.log("Erro ao apagar filme", err));
  };




    useEffect(() => {
      getFilmes();
    }, [refreshFilmes]);

  return (
    <>

      <div className="grid">
        {FilmesList.map(filme => (
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

              <div className="poster-placeholder">
                <i className="ti ti-movie poster-icon"></i>
              </div>

              <div className="views-badge">
                  <i className="ti ti-eye icon-eye"></i>
                    {filme.visualizacoes ?? 0}
              </div>

              <div className="badge">
                <i className="ti ti-star icon-star"></i>
                {filme.nota_media ? filme.nota_media.toFixed(1) : "N/A"}
              </div>

              <span className="genre-tag">
                {filme.genero}
              </span>

              {user?.user?.is_superuser && (
                <button
                  className="btn-delete"
                  onClick={(e) => handleApagarFilme(e, filme.id)}
                >
                  <i className="ti ti-trash"></i>
                </button>
              )}

            </div>

            <div className="card-title">
              {filme.titulo}
            </div>

            <div className="card-meta">
              {filme.lancamento}
            </div>

            <div className="card-director">
              <i className="ti ti-user icon-user"></i>
              <span>
                {filme.diretor?.map(d => d.nome).join(", ")}
              </span>
            </div>

          </div>
        ))}
      </div>

      {showTmdb && (
        <TmdbModal
          onClose={() => setShowTmdb(false)}
          onImported={getFilmes}
        />
      )}
    </>
  );
}

export default List;