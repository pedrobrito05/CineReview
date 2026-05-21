import { useState } from 'react'
import '../styles.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

import TmdbModal from "./TmdbModal";

function NavBar({ user, setUser, onImported }) {


    const [showTmdb, setShowTmdb] = useState(false);

    const navigate = useNavigate();

    const URL_LOGOUT = 'http://localhost:8000/api/logout/';

    const handleLogout = () => {
        axios.get(URL_LOGOUT, {withCredentials: true})
            .then(() => {
                setUser(null);
                navigate('/');
            })
            .catch(() => console.log('logout failed'));
    };

    return (
        <>
            <nav className="navbar">

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '28px'
                    }}
                >

                    <a
                        className="nb-logo"
                        onClick={() => navigate('/')}
                        style={{cursor: 'pointer'}}
                    >
                        <span>Cine</span>Review
                    </a>

                    <div className="nb-links">
                        <a className="nb-link" href="#">
                            Início
                        </a>

                        <a className='nb-links' onClick={ ()=>navigate('/filmes')}>
                            Filmes
                        </a>

                        <a className="nb-link" href="#">
                            Listas
                        </a>

                        <a className="nb-link" href="#">
                            Membros
                        </a>

                        <a className="nb-link" href="#">
                            Diário
                        </a>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >

                    <input
                        className="nb-search"
                        placeholder="Pesquisar..."
                    />

                    {user?.user?.username && (
                        <button
                            className="btn-tmdb"
                            onClick={() => setShowTmdb(true)}
                        >
                        <span className="tmdb-badge">
                            TMDB
                        </span>

                            Importar Filme
                        </button>
                    )}

                    {user?.user?.username ? (
                        <>
                            <a
                                className="nb-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </a>

                            <div className="nb-avatar">

                                {user.imagem ? (
                                    <img
                                        src={`http://localhost:8000${user.imagem}`}
                                        alt="Perfil"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                        onClick={() =>
                                            navigate("/profile/" + user.id)
                                        }
                                    />
                                ) : (
                                    typeof user.user.username === 'string'
                                        ? user.user.username
                                            .slice(0, 2)
                                            .toUpperCase()
                                        : "US"
                                )}

                            </div>
                        </>
                    ) : (
                        <a
                            className="nb-btn"
                            onClick={() => navigate('/login')}
                        >
                            Entrar
                        </a>
                    )}
                </div>
            </nav>

            {showTmdb && (
                <TmdbModal
                    onClose={() => setShowTmdb(false)}
                    onImported={()=>navigate('/home')}
                />
            )}
        </>
    )

}
export default NavBar;
