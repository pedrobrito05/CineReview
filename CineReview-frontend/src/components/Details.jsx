import '../styles.css'
import { useParams } from 'react-router-dom'
import {useEffect, useState} from "react";
import axios from "axios";
function Details(){
    const URL_FILMES = "http://localhost:8000/api/filmes/"
    const URL_REVIEWS = "http://localhost:8000/api/reviewsDeFilme/"


    const { id } = useParams()
    const [filme, setFilme] = useState(null)
    const [review, setReview] = useState([])

    const getFilme = () => {
        axios.get(`${URL_FILMES}${id}/`)
            .then((request) => { setFilme(request.data) })
    }
    const getReviews = () => {
    axios.get(`${URL_REVIEWS}${id}/`)
    .then( (request) => {setReview(request.data)});
    };


    useEffect(() => {
        getFilme()
        getReviews();
    }, [id])

    if (!filme) return <p>A carregar...</p>
    return (
        <div className="page">
            <div className="hero">
                <div className="poster-wrap">
                    <div className="poster">
                        <img src={`http://localhost:8000/${filme.imagem}`} />
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
                        {
                            filme.diretor.map((diretor)=>
                            <span className="director-label">{diretor.nome}</span>
                            )
                        }



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
                        <button className="btn-primary"><i className="ti ti-eye" aria-hidden="true"></i> Já vi
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
                    {filme.elenco.map((ator)=>
                        <div className="cast-card">
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
        {review.map((rev)=>
            <div className="review-card">
            <div className="review-header">
                <div className="cast-avatar">PB</div>
                <div className="review-meta">
                    <span className="cast-name">{rev.utilizador.user.username}</span>
                    <span className="cast-role">{rev.data}</span>
                </div>
                <div className="review-rating">
                    <i className="ti ti-star star" style={{fontSize:'13px'}}></i>
                    <span className="rating-num" style={{fontSize:'16px'}}>{rev.avaliacao}</span>
                    <span className="rating-max">/ 10</span>
                </div>
            </div>
            <p className="review-text">{rev.texto}</p>
            <div className="review-footer">
                <button className="review-like">
                    <i className="ti ti-heart"></i> {rev.total_gostos}
                </button>
            </div>
        </div>
        )}


    </div>
</div>
        </div>
    )
}

export default Details