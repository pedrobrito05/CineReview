import { useState } from 'react'
import '../styles.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NavBar({ user, setUser }) {
    const [useRealApi, setUseRealApi] = useState(false)
    const navigate = useNavigate()
    const URL_LOGOUT = 'http://localhost:8000/api/logout/';

    const handleLogout = () => {
        axios.get(URL_LOGOUT, { withCredentials: true })
            .then(() => {
                setUser(null);
                navigate('/');
            })
            .catch(() => console.log('logout failed'));
    };

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                <a className="nb-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <span>Cine</span>Review
                </a>
                <div className="nb-links">
                    <a className="nb-link active" href="#">Início</a>
                    <a className="nb-link" href="#">Filmes</a>
                    <a className="nb-link" href="#">Listas</a>
                    <a className="nb-link" href="#">Membros</a>
                    <a className="nb-link" href="#">Diário</a>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input className="nb-search" placeholder="Pesquisar..." />

                <div className="api-toggle" onClick={() => setUseRealApi(prev => !prev)}>
                    <span className={!useRealApi ? 'toggle-option active' : 'toggle-option'}>Local</span>
                    <div className={`toggle-track ${useRealApi ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                    </div>
                    <span className={useRealApi ? 'toggle-option active' : 'toggle-option'}>TMDB</span>
                </div>

                {user?.user?.username ? (
                    <>
                        <a className="nb-btn" onClick={handleLogout}>Logout</a>
                        <div className="nb-avatar">
                            {user.imagem ? (
                                <img
                                    src={`http://localhost:8000${user.imagem }`}
                                    alt="Perfil"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    onClick={()=>navigate("/profile/"+user.id)}
                                />
                            ) : (
                                typeof user.user.username === 'string' ? user.user.username.slice(0, 2).toUpperCase() : "US"
                            )}
                        </div>
                    </>
                ) : (
                    <a className="nb-btn" onClick={() => navigate('/login')}>Entrar</a>
                )}
            </div>
        </nav>
    )
}

export default NavBar;