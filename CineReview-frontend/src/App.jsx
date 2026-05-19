import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from "./pages/Home.jsx";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import Details from "./pages/Details.jsx";


function App() {

    const [username, setUsername] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const URL_USER = "http://localhost:8000/api/user/";

    const getUtilizador = () => {
        axios.get(URL_USER, { withCredentials: true })
            .then((request) => {
                if (request.data && request.data.user) {
                    setUsername(request.data.user.username);
                    setUserImage(request.data.imagem);
                }
            })
            .catch(() => {
                setUsername(null);
                setUserImage(null);
            });
    };

    useEffect(() => {
        getUtilizador();
    }, []);
    return (
        <>
            <NavBar
                username={username}
                userImage={userImage}
                setUsername={setUsername}
                setUserImage={setUserImage}
            />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/filme/:id" element={<Details username={username} />} />

                <Route path="/login" element={<Login onLoginSuccess={getUtilizador} />} />

            </Routes>
            <Footer />
        </>
    )
}

export default App