import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Initial from "./pages/Initial.jsx"
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import Details from "./pages/Details.jsx";
import Profile from "./pages/Profile.jsx";
import TestAuth from "./pages/TestAuth.jsx";
import List from "./pages/List.jsx"
import Users from "./pages/Users.jsx";


function App() {

    const [user, setUser] = useState(null);
    const [refreshFilmes, setRefreshFilmes] = useState(0);

    const URL_USER = "http://localhost:8000/api/user/";
    axios.defaults.withCredentials = true;

    const getUtilizador = () => {
        axios.get(URL_USER, { withCredentials: true })
            .then((request) => setUser(request.data))
            .catch(() => setUser(null));
    };

    useEffect(() => {
        getUtilizador();
    }, []);

    return (
        <>
            <NavBar
                user={user}
                setUser={setUser}
                onImported={() => setRefreshFilmes(r => r + 1)}
            />

            <Routes>
                <Route path="/" element={<Initial />} />

                <Route path="/filmes" element={<List user={user} refreshFilmes={refreshFilmes} />} />

                <Route path="/filme/:id" element={<Details user={user} />} />

                <Route path="/login" element={<Login onLoginSuccess={getUtilizador} />} />

                <Route path="/profile/:id" element={<Profile user={user} />} />

                <Route path="/signup" element={<SignUp />} />

                <Route path="/teste" element={<TestAuth />} />

                <Route path="/users" element={<Users />} />
            </Routes>

            <Footer />
        </>
    )
}

export default App