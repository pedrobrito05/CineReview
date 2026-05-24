import '../styles.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        axios.get("http://localhost:8000/api/users/", { withCredentials: true })
            .then(res => setUsers(res.data))
            .catch(err => console.log("Erro ao buscar utilizadores", err));
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="page">
            <div className="section">
                <p className="section-title">Membros ({users.length})</p>

                <div className="cast-grid">
                    {users.map(u => (
                        <div
                            className="cast-card"
                            key={u.id}
                            onClick={() => navigate(`/profile/${u.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="cast-avatar">
                                {u.imagem ? (
                                    <img
                                        src={`http://localhost:8000${u.imagem}`}
                                        alt={u.user?.username}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    u.user?.username?.slice(0, 2).toUpperCase()
                                )}
                            </div>
                            <div className="cast-info">
                                <span className="cast-name">{u.user?.username}</span>
                                {u.user?.is_superuser && (
                                    <span className="director-label">Admin</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Users;