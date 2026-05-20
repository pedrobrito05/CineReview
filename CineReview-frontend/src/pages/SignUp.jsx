import '../styles.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";



function SignUp() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)
    
    const navigate = useNavigate()
    const URL_SIGNUP = 'http://localhost:8000/api/create_account/';

    const handleSignUp = (e) => {
        e.preventDefault();
        setErrorMsg(null); // Limpa erros antigos


        if (password !== confirmPassword) {
            setErrorMsg("As passwords não coincidem!");
            return;
        }

        //dados para a view
        const dadosRegisto = {
            username: username,
            password: password
        };

        axios.post(URL_SIGNUP, dadosRegisto)
            .then((response) => {
                console.log('Conta criada com sucesso:', response.data);
                // redirecionamento
                navigate('/login');
            })
            .catch((error) => {
                console.log('Registo falhou');
                // erro, mostra o erro
                if (error.response && error.response.data && error.response.data.msg) {
                    setErrorMsg(error.response.data.msg);
                } else {
                    setErrorMsg("Ocorreu um erro ao criar a conta. Tenta novamente.");
                }
            });
    };

    return (
        <div className="login-page"> {/* Mantém as mesmas classes para herdar o estilo */}
            <div className="login-card">
                <a className="nb-logo" onClick={() => navigate('/')} style={{marginBottom: '24px', display: 'block', textAlign: 'center', fontSize: '24px', cursor: 'pointer'}}>
                    <span>Cine</span>Review
                </a>
                <p className="login-subtitle">Cria a tua conta para começares a avaliar filmes</p>


                {errorMsg && (
                    <p style={{ color: '#ff4d4d', textAlign: 'center', fontSize: '14px', marginBottom: '15px', fontWeight: 'bold' }}>
                        {errorMsg}
                    </p>
                )}

                <form className="login-form" onSubmit={handleSignUp}>
                    <div className="login-field">
                        <label className="login-label">Username</label>
                        <input
                            className="login-input"
                            type="text"
                            placeholder="escolhe o teu username"
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
                            placeholder="introduz a tua password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Confirmar Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="repete a tua password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: '10px'}}>
                        <i className="ti ti-user-plus" aria-hidden="true"></i> Criar Conta
                    </button>
                    
                    <button type="button" className="btn-secondary" style={{width: '100%', justifyContent: 'center'}} onClick={() => navigate('/login')}>
                        <i className="ti ti-arrow-left" aria-hidden="true"></i> Já tenho conta (Login)
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUp;