import '../styles.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";
import axios from "axios";

function Details({ user }) {
    const URL_FILMES = "http://localhost:8000/api/filmes/"
    const URL_REVIEWS = "http://localhost:8000/api/reviewsDeFilme/"
    const URL_REVIEWS_INSERT = "http://localhost:8000/api/reviews/"

    const { id } = useParams()

    const [filme, setFilme] = useState(null)
    const [review, setReview] = useState([])
    const [review2, setReview2] = useState("")
    const [nota, setNota] = useState("")

    // funcao para esperar cookie CSRF
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

    const getFilme = () => {
        axios.get(`${URL_FILMES}${id}/`, {
            withCredentials: true
        })
        .then((request) => {
            setFilme(request.data)
        })
    }

    const getReviews = () => {
        axios.get(`${URL_REVIEWS}${id}/`, {
            withCredentials: true
        })
        .then((request) => {
            setReview(request.data)
        })
        .catch(() => setReview([]));
    };

    const handleReview = (e) => {
        e.preventDefault()

        const dadosReview = {
            avaliacao: nota,
            texto: review2,
            filme: filme.id
        }

        const csrfToken = getCookie("csrftoken");

        axios.post(URL_REVIEWS_INSERT, dadosReview, {
            withCredentials: true,
            headers: {
                "X-CSRFToken": csrfToken
            }
        })
        .then((response) => {
            console.log("review inserida com sucesso")


        getReviews()
        getFilme()


        setReview2("")
        setNota("")
        })
        .catch((error) => {
            console.log("Erro na inserção da review", error.response?.data)
        })
    }

    useEffect(() => {
        getFilme()
        getReviews()
    }, [id])

    if (!filme) return <p>A carregar...</p>

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
                        <span className="meta-year">2023</span>
                        <span className="meta-dot">·</span>
                        <span className="meta-genre">{filme.genero}</span>
                    </div>

                    <div className="director-row">
                        {filme.diretor.map((diretor) =>
                            <span key={diretor.id} className="director-label">{diretor.nome}</span>
                        )}
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
                        <button className="btn-primary">
                            <i className="ti ti-eye"></i> Já vi
                        </button>
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
                    {filme.elenco.map((ator) =>
                        <div className="cast-card" key={ator.id}>
                            <div className="cast-avatar">MF</div>
                            <div className="cast-info">
                                <span className="cast-name">{ator.nome}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="section">
                <p className="section-title">Reviews ({review.length})</p>

                <div className="reviews-grid">
                    {review.map((rev) => (
                        <div className="review-card" key={rev.id}>
                            <div className="review-header">
                                <div className="cast-avatar">PB</div>

                                <div className="review-meta">
                                    <span className="cast-name">
                                        {rev.utilizador?.user?.username}
                                    </span>
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
                                <button className="review-like">
                                    <i className="ti ti-heart"></i> {rev.total_gostos || 0}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {user.user.username ? (
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
                    <p className="synopsis">
                        Tens de estar logado para adicionar uma review.
                    </p>
                </div>
            )}

        </div>
    )
}

export default Details;