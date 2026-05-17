import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from "./pages/Home.jsx";

import DetailsPage from "./pages/DetailsPage.jsx";


function App() {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filme/:id" element={<DetailsPage />} />
            </Routes>
            <Footer />
        </>
    )
}

export default App