import '../styles.css'
import {useNavigate} from "react-router-dom";
function Footer() {
    const navigate=useNavigate()
    return (
        <footer className="footer">
            <a className="nb-logo" href="#"><span>Cine</span>Review</a>
            <p className="footer-copy" onClick={()=>navigate('/')}>© 2026 CineReview. Todos os direitos reservados.</p>
        </footer>
    )
}

export default Footer