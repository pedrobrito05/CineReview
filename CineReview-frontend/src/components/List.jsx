
import '../styles.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TmdbModal from "./TmdbModal";

const apiAxios = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

function List() {
  const navigate = useNavigate();

  const [FilmesList, setFilmesList] = useState([]);
  const [showTmdb, setShowTmdb] = useState(false);

  const getFilmes = () => {
    apiAxios
      .get("/api/filmes/")
      .then(res => setFilmesList(res.data));
  };

  useEffect(() => {
    getFilmes();
  }, []);

  return (
    <>


      <div className="grid">

        {FilmesList.map(filme => (
          <div
            className="card"
            key={filme.id}
            onClick={() =>
              navigate(`/filme/${filme.id}/`)
            }
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
                100
              </div>

              <div className="badge">
                <i className="ti ti-star icon-star"></i>
                6.7
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
              <i className="ti ti-user icon-user"></i>

              <span>
                {filme.diretor
                  ?.map(d => d.nome)
                  .join(", ")}
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

