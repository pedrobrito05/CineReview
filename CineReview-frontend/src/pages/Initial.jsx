import '../styles.css'
import { useNavigate } from 'react-router-dom'

function Initial() {

    const navigate = useNavigate();

    return (
        <div className="initial-page">

            <div className="initial-overlay"></div>

            <img
                className="poster1 img1"
                src="https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg"
                alt=""
            />

            <img
                className="poster1 img2"
                src="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
                alt=""
            />

            <img
                className="poster1 img3"
                src="https://cdn.europosters.eu/image/350/posters/avengers-endgame-i122136.jpg"
                alt=""
            />

            <img
                className="poster1 img4"
                src="https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
                alt=""
            />

            <img
                className="poster1 img5"
                src="https://image.tmdb.org/t/p/w500/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg"
                alt=""
            />

            <img
                className="poster1 img6"
                src="https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"
                alt=""
            />

            <div className="initial-content">

                <h1>Cine<span>Review</span></h1>

                <p>Partilhe a sua experiência.
                <br />Veja opiniões e descubra grandes filmes.</p>

                <button onClick={() => navigate('/home')}>
                    Ver Reviews
                </button>

            </div>

        </div>

    );
}

export default Initial;