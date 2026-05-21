import '../styles.css'
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TMDB_API_KEY = "0dbcce457b6c51ad5cf8259e6b311cec";
const TMDB_BASE = "https://api.themoviedb.org/3";

const tmdbAxios = axios.create({ withCredentials: false });
const apiAxios = axios.create({ baseURL: "http://localhost:8000", withCredentials: true });
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
// Mapa de géneros TMDB → choices do teu backend
const GENERO_MAP = {
  "Action": "action",
  "Adventure": "adventure",
  "Animation": "animation",
  "Comedy": "comedy",
  "Crime": "crime",
  "Documentary": "documentary",
  "Drama": "drama",
  "Family": "family",
  "Fantasy": "fantasy",
  "History": "history",
  "Horror": "horror",
  "Music": "music",
  "Mystery": "mystery",
  "Romance": "romance",
  "Science Fiction": "sci_fi",
  "Thriller": "thriller",
  "War": "war",
  "Western": "western",
};

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

function TmdbModal({ onClose, onImported }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(null);
  const [erro, setErro] = useState(null);
  const inputRef = useRef();

  useEffect(() => inputRef.current?.focus(), []);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setErro(null);
    setResults([]);
    try {
      const res = await tmdbAxios.get(`${TMDB_BASE}/search/movie`, {
        params: { api_key: TMDB_API_KEY, query, language: "pt-PT" }
      });
      setResults(res.data.results.slice(0, 8));
    } catch (err) {
      setErro("Erro ao pesquisar. Verifica a API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const importFilme = async (tmdbFilme) => {
    setImporting(tmdbFilme.id);
    setErro(null);
    try {
      const [details, credits] = await Promise.all([
        tmdbAxios.get(`${TMDB_BASE}/movie/${tmdbFilme.id}`, {
          params: { api_key: TMDB_API_KEY, language: "pt-PT" }
        }),
        tmdbAxios.get(`${TMDB_BASE}/movie/${tmdbFilme.id}/credits`, {
          params: { api_key: TMDB_API_KEY }
        })
      ]);

      const d = details.data;

      // Género: converte do nome TMDB para o choice do backend
      const generoTmdb = d.genres?.[0]?.name || "";
      const genero = GENERO_MAP[generoTmdb] || "drama"; // fallback para drama

      // Diretores
      const diretores = credits.data.crew
        .filter(p => p.job === "Director")
        .map(p => p.name);

      // Elenco (primeiros 10)
      const elenco = credits.data.cast
        .slice(0, 10)
        .map(p => p.name);

      // Descarregar poster como ficheiro
      let imagemFile = null;
      if (d.poster_path) {
        const imageUrl = `https://image.tmdb.org/t/p/w500${d.poster_path}`;
        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();
        const filename = `${d.id}_poster.jpg`;
        imagemFile = new File([blob], filename, { type: "image/jpeg" });
      }

      // Construir FormData (necessário para enviar imagem)
      const formData = new FormData();
      formData.append("titulo", d.title);
      formData.append("lancamento", d.release_date || "2000-01-01");
      formData.append("genero", genero);
      formData.append("resumo", d.overview?.slice(0, 500) || "");
      if (imagemFile) formData.append("imagem", imagemFile);

      // Diretores e elenco como JSON strings (o backend terá de tratar)
      diretores.forEach(nome => formData.append("diretores", nome));
      elenco.forEach(nome => formData.append("elenco", nome));

      const csrfToken = getCookie("csrftoken");

      await apiAxios.post("/api/filmes/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data"
        }
      });

      onImported();
      onClose();
    } catch (err) {
      console.error(err);
      setErro(`Erro ao importar: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="tmdb-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tmdb-modal">

        <div className="tmdb-modal-header">
          <span className="tmdb-logo">TMDB</span>
          <h2>Importar filme</h2>
          <button className="tmdb-close" onClick={onClose}>✕</button>
        </div>

        <div className="tmdb-search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar filme..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
          />
          <button onClick={search} disabled={loading}>
            {loading ? "..." : "Pesquisar"}
          </button>
        </div>

        {erro && <div className="tmdb-erro">{erro}</div>}

        <div className="tmdb-results">
          {results.length === 0 && !loading && !erro && (
            <div className="tmdb-vazio">Pesquisa um filme acima.</div>
          )}
          {results.map(filme => (
            <div key={filme.id} className="tmdb-result-item">
              {filme.poster_path
                ? <img src={`https://image.tmdb.org/t/p/w92${filme.poster_path}`} alt={filme.title} />
                : <div className="tmdb-no-poster">🎬</div>
              }
              <div className="tmdb-result-info">
                <strong>{filme.title}</strong>
                <span>{filme.release_date?.split("-")[0]}</span>
              </div>
              <button
                className="tmdb-import-btn"
                onClick={() => importFilme(filme)}
                disabled={importing === filme.id}
              >
                {importing === filme.id ? "A importar..." : "Importar"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function List() {
  const navigate = useNavigate();
  const [FilmesList, setFilmesList] = useState([]);
  const [showTmdb, setShowTmdb] = useState(false);

  const getFilmes = () => {
    apiAxios.get("/api/filmes/").then(res => setFilmesList(res.data));
  };

  useEffect(() => { getFilmes(); }, []);

  return (
    <>
      <div className="list-header">
        <button className="btn-tmdb" onClick={() => setShowTmdb(true)}>
          <span className="tmdb-badge">TMDB</span>
          Importar da TMDB
        </button>
      </div>

      <div className="grid">
        {FilmesList.map(filme => (
          <div className="card" key={filme.id} onClick={() => navigate(`/filme/${filme.id}/`)}>
            <div className="poster">
              <img src={`http://localhost:8000${filme.imagem}`} alt={filme.titulo} />
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
              <span className="genre-tag">{filme.genero}</span>
            </div>
            <div className="card-title">{filme.titulo}</div>
            <div className="card-meta">{filme.lancamento}</div>
            <div className="card-director">
              <i className="ti ti-user icon-user"></i>
              <span>{filme.diretor.map(d => d.nome).join(", ")}</span>
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