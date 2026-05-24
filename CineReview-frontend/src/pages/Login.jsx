import '../styles.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const URL_LOGIN = 'http://localhost:8000/api/login/';

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(URL_LOGIN, { username, password }, { withCredentials: true })
            .then(() => {
                console.log('logged in');

                //busca dados a api depois do login da app.jsx para nao temros de dar refresh
                if (onLoginSuccess) {
                    onLoginSuccess();
                }

                navigate('/');
            })
            .catch(() => console.log('login failed'))
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <a className="nb-logo" onClick={() => navigate('/')} style={{ marginBottom: '24px', display: 'block', textAlign: 'center', fontSize: '24px', cursor: 'pointer' }}>
                    <span>Cine</span>Review
                </a>
                <p className="login-subtitle">Entra na tua conta para continuar</p>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-field">
                        <label className="login-label">Username</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="o teu username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="a tua password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <i className="ti ti-login" aria-hidden="true"></i> Entrar
                    </button>

                    <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/')}>
                        <i className="ti ti-arrow-left" aria-hidden="true"></i> Voltar
                    </button>

                    <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/signup')}>
                        <i className="ti ti-user icon-user" aria-hidden="true"></i> Criar conta
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;