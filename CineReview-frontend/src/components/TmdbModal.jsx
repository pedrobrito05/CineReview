import { useEffect, useState, useRef } from "react";
import axios from "axios";

const TMDB_API_KEY = "0dbcce457b6c51ad5cf8259e6b311cec";
const TMDB_BASE = "https://api.themoviedb.org/3";

const tmdbAxios = axios.create({ withCredentials: false });
const apiAxios = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

const GENERO_MAP = {
28: "action",
12: "adventure",
16: "animation",
35: "comedy",
80: "crime",
99: "documentary",
18: "drama",
10751: "family",
14: "fantasy",
36: "history",
27: "horror",
10402: "music",
9648: "mystery",
10749: "romance",
878: "sci_fi",
53: "thriller",
10752: "war",
37: "western"
};


function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();

      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );
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

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const search = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setErro(null);
    setResults([]);

    try {
      const res = await tmdbAxios.get(
        `${TMDB_BASE}/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query,
            language: "pt-PT"
          }
        }
      );

      setResults(res.data.results.slice(0, 8));
    } catch (err) {
      console.error(err);
      setErro("Erro ao pesquisar. Verifica a API key.");
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
          params: {
            api_key: TMDB_API_KEY,
            language: "pt-PT"
          }
        }),

        tmdbAxios.get(`${TMDB_BASE}/movie/${tmdbFilme.id}/credits`, {
          params: {
            api_key: TMDB_API_KEY
          }
        })
      ]);

      const d = details.data;

      const generoId = d.genres?.[0]?.id;
      const genero = GENERO_MAP[generoId] || "drama";

      const diretores = credits.data.crew
        .filter(p => p.job === "Director")
        .map(p => p.name);

      const elenco = credits.data.cast
        .slice(0, 10)
        .map(p => p.name);

      let imagemFile = null;

      if (d.poster_path) {
        const imageUrl =
          `https://image.tmdb.org/t/p/w500${d.poster_path}`;

        const imageRes = await fetch(imageUrl);
        const blob = await imageRes.blob();

        imagemFile = new File(
          [blob],
          `${d.id}_poster.jpg`,
          { type: "image/jpeg" }
        );
      }

      const formData = new FormData();

      formData.append("titulo", d.title);
      formData.append(
        "lancamento",
        d.release_date || "2000-01-01"
      );
      formData.append("genero", genero);
      formData.append(
        "resumo",
        d.overview?.slice(0, 500) || ""
      );

      if (imagemFile) {
        formData.append("imagem", imagemFile);
      }

      diretores.forEach(nome => {
        formData.append("diretores", nome);
      });

      elenco.forEach(nome => {
        formData.append("elenco", nome);
      });

      const csrfToken = getCookie("csrftoken");

      await apiAxios.post("/api/importar_tmdb/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/filmes");
      onClose();

    } catch (err) {
      console.error(err);

      setErro(
        `Erro ao importar: ${
          err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message
        }`
      );
    } finally {
      setImporting(null);
    }
  };

  return (
    <div
      className="tmdb-overlay"
      onClick={e =>
        e.target === e.currentTarget && onClose()
      }
    >
      <div className="tmdb-modal">

        <div className="tmdb-modal-header">
          <span className="tmdb-logo">TMDB</span>

          <h2>Importar filme</h2>

          <button
            className="tmdb-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="tmdb-search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar filme..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e =>
              e.key === "Enter" && search()
            }
          />

          <button
            onClick={search}
            disabled={loading}
          >
            {loading ? "..." : "Pesquisar"}
          </button>
        </div>

        {erro && (
          <div className="tmdb-erro">
            {erro}
          </div>
        )}

        <div className="tmdb-results">

          {results.length === 0 &&
            !loading &&
            !erro && (
              <div className="tmdb-vazio">
                Pesquisa um filme acima.
              </div>
          )}

          {results.map(filme => (
            <div
              key={filme.id}
              className="tmdb-result-item"
            >
              {filme.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${filme.poster_path}`}
                  alt={filme.title}
                />
              ) : (
                <div className="tmdb-no-poster">
                  🎬
                </div>
              )}

              <div className="tmdb-result-info">
                <strong>{filme.title}</strong>

                <span>
                  {filme.release_date?.split("-")[0]}
                </span>
              </div>

              <button
                className="tmdb-import-btn"
                onClick={() => importFilme(filme)}
                disabled={importing === filme.id}
              >
                {importing === filme.id
                  ? "A importar..."
                  : "Importar"}
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default TmdbModal;

