import '../styles.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";

function Details({ user }) {
    const URL_FILMES = "http://localhost:8000/api/filmes/";
    const URL_REVIEWS = "http://localhost:8000/api/reviewsDeFilme/";
    const URL_REVIEWS_INSERT = "http://localhost:8000/api/reviews/";
    const URL_VISTO = "http://localhost:8000/api/visto/";

    const { id } = useParams();

    const [filme, setFilme] = useState(null);
    const [review, setReview] = useState([]);
    const [review2, setReview2] = useState("");
    const [nota, setNota] = useState("");
    const [jaViu, setJaViu] = useState(false);

    // obter cookie csrf
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

    // buscar dados do filme
    const getFilme = () => {
        axios.get(`${URL_FILMES}${id}/`, { withCredentials: true })
            .then((request) => setFilme(request.data));
    };

    // buscar reviews do filme
    const getReviews = () => {
        axios.get(`${URL_REVIEWS}${id}/`, { withCredentials: true })
            .then((request) => setReview(request.data))
            .catch(() => setReview([]));
    };

    // verificar se filme visto
    const checkVisto = () => {
        if (!user?.id) return;
        axios.get(`http://localhost:8000/api/filmesVistos/${user.id}/`, { withCredentials: true })
            .then((res) => {
                const visto = res.data.some((f) => f.id === parseInt(id));
                setJaViu(visto);
            })
            .catch(() => setJaViu(false));
    };

    // enviar nova review
    const handleReview = (e) => {
        e.preventDefault();

        const dadosReview = {
            avaliacao: nota,
            texto: review2,
            filme: filme.id
        };

        const csrfToken = getCookie("csrftoken");

        axios.post(URL_REVIEWS_INSERT, dadosReview, {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken }
        })
        .then(() => {
            console.log("review inserida com sucesso");
            getReviews();
            getFilme();
            setReview2("");
            setNota("");
        })
        .catch((error) => {
            console.log("Erro na inserção da review", error.response?.data);
        });
    };

    // alternar estado de visto
    const handleVisto = () => {
        const csrfToken = getCookie("csrftoken");
        axios.post(URL_VISTO, { filme: filme.id }, {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken }
        })
        .then(() => setJaViu(!jaViu))
        .catch((err) => console.log("Erro ao marcar como visto", err));
    };

    const handleLike = (reviewId) => {
    const csrfToken = getCookie("csrftoken");
        axios.post(`http://localhost:8000/api/likeReview/${reviewId}/`, {}, {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken }
        })
        .then(() => getReviews())
        .catch((err) => console.log("Erro ao dar like", err));
    };

    const handleApagarReview = (reviewId) => {
        if (!window.confirm('Tens a certeza que queres apagar esta review?')) return;
        const csrfToken = getCookie("csrftoken");
        axios.delete(`http://localhost:8000/api/reviews/${reviewId}/apagar/`, {
            withCredentials: true,
            headers: { "X-CSRFToken": csrfToken }
        })
        .then(() => getReviews())
        .catch((err) => console.log("Erro ao apagar review", err));
    };



    // carregar dados do componente
    useEffect(() => {
        getFilme();
        getReviews();
        checkVisto();
    }, [id]);

    if (!filme) return <p>A carregar...</p>;

    return (
        <div className="page">
            <div className="hero">
                <div className="poster-wrap">
                    <div className="poster">
                        <img src={`http://localhost:8000${filme.imagem}`} alt={filme.titulo} />
                    </div>
                </div>

                <div className="info">
                    <h1 className="movie-title">{filme.titulo}</h1>

                    <div className="movie-meta">
                        <span className="meta-year">{filme.lancamento?.slice(0, 4)}</span>
                        <span className="meta-dot">·</span>
                        <span className="meta-genre">{filme.genero}</span>
                    </div>

                    <div className="director-row">
                        {filme.diretor.map((diretor) => (
                            <span key={diretor.id} className="director-label">{diretor.nome}</span>
                        ))}
                    </div>

                    <div className="rating-row">
                        <div className="stars">
                            <i className="ti ti-star star"></i>
                            <i className="ti ti-star star"></i>
                            <i className="ti ti-star star"></i>
                            <i className="ti ti-star star"></i>
                            <i className="ti ti-star star empty"></i>
                        </div>
                        <span className="rating-num">{filme.nota_media}</span>
                        <span className="rating-max">/ 10</span>
                        <span className="rating-count">({review.length} avaliações)</span>
                    </div>

                    <div className="actions">
                        {user?.user?.username && (
                        <button
                            className={jaViu ? "btn-primary btn-active" : "btn-primary"}
                            onClick={handleVisto}
                        >
                            <i className={jaViu ? "ti ti-eye-check" : "ti ti-eye"}></i>
                            {jaViu ? "Visto" : "Já vi"}
                        </button>
                            )}
                    </div>

                </div>
            </div>

            <div className="section">
                <p className="section-title">Sinopse</p>
                <p className="synopsis">{filme.resumo}</p>
            </div>

            <div className="section">
                <p className="section-title">Elenco principal</p>
                <div className="cast-grid">
                    {filme.elenco.map((ator) => (
                        <div className="cast-card" key={ator.id}>
                            <div className="cast-avatar">
                                <img
                                    src={`http://localhost:8000${ator.imagem}`}
                                    alt={ator.nome}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="cast-info">
                                <span className="cast-name">{ator.nome}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section">
                <p className="section-title">Reviews ({review.length})</p>
                <div className="reviews-grid">
                    {review.map((rev) => (
                        <div className="review-card" key={rev.id}>
                            <div className="review-header">
                                <div className="cast-avatar">
                                    {rev.utilizador?.imagem ? (
                                        <img
                                            src={`http://localhost:8000${rev.utilizador.imagem}`}
                                            alt={rev.utilizador?.user?.username}
                                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        rev.utilizador?.user?.username?.slice(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div className="review-meta">
                                    <span className="cast-name">{rev.utilizador?.user?.username}</span>
                                    <span className="cast-role">{rev.data}</span>
                                </div>
                                <div className="review-rating">
                                    <i className="ti ti-star star"></i>
                                    <span className="rating-num">{rev.avaliacao}</span>
                                    <span className="rating-max">/ 10</span>
                                </div>
                            </div>
                            <p className="review-text">{rev.texto}</p>

                            <div className="review-footer">
                                <button className="review-like" onClick={() => user?.user?.username && handleLike(rev.id)}>
                                    <i className="ti ti-heart"></i> {rev.total_gostos || 0}
                                </button>

                                {(user?.user?.is_superuser || user?.user?.username === rev.utilizador?.user?.username) && (
                                    <button
                                        className="btn-delete-review"
                                        onClick={() => handleApagarReview(rev.id)}
                                    >
                                        <i className="ti ti-trash"></i> Apagar
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {user?.user?.username ? (
                <div className="section">
                    <p className="section-title">Adicionar Review</p>
                    <div className="review-form">
                        <div className="review-form-rating">
                            <span className="director-label">Avaliação</span>
                            <input
                                className="review-form-score"
                                type="number"
                                min="1"
                                max="10"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                            />
                            <span className="rating-max">/ 10</span>
                        </div>
                        <textarea
                            className="review-form-text"
                            placeholder="Escreve a tua review..."
                            rows={4}
                            value={review2}
                            onChange={(e) => setReview2(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleReview}>
                            <i className="ti ti-send"></i> Publicar Review
                        </button>
                    </div>
                </div>
            ) : (
                <div className="section">
                    <p className="synopsis">Tens de estar logado para adicionar uma review.</p>
                </div>
            )}
        </div>
    );
}

export default Details;