import { useState } from 'react'
import '../styles.css'
import {useNavigate} from "react-router-dom";
function NavBar() {
    const [useRealApi, setUseRealApi] = useState(false)
    const navigate=useNavigate()
    return (
        <nav className="navbar">
            <div style={{display:'flex', alignItems:'center', gap:'28px'}}>
                <a className="nb-logo" onClick={()=>navigate('/')}><span>Cine</span>Review</a>
                <div className="nb-links">
                    <a className="nb-link active" href="#">Início</a>
                    <a className="nb-link" href="#">Filmes</a>
                    <a className="nb-link" href="#">Listas</a>
                    <a className="nb-link" href="#">Membros</a>
                    <a className="nb-link" href="#">Diário</a>
                </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <input className="nb-search" placeholder="Pesquisar..." />

                <div className="api-toggle" onClick={() => setUseRealApi(prev => !prev)}>
                    <span className={!useRealApi ? 'toggle-option active' : 'toggle-option'}>Local</span>
                    <div className={`toggle-track ${useRealApi ? 'on' : ''}`}>
                        <div className="toggle-thumb" />
                    </div>
                    <span className={useRealApi ? 'toggle-option active' : 'toggle-option'}>TMDB</span>
                </div>

                <a className="nb-btn" href="#">Entrar</a>
                <div className="nb-avatar">PB</div>
            </div>
        </nav>
    )
}

export default NavBar