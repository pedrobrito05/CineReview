import '../styles.css'
import {useEffect, useState} from "react";
import axios from "axios";

function List() {

    const URL_FILMES = "http://localhost:8000/api/filmes/";
    const [FilmesList, setFilmesList] = useState([]);
    const getFilmes = () => {
    axios.get(URL_FILMES)
    .then( (request) => {setFilmesList(request.data)});
    };
    useEffect( () => {
    getFilmes();
    }, []);

  return (
      <div className="grid">



          {
              FilmesList.map((filme)=>(
                    <div className="card" key={filme.id}>
                      <div className="poster">
                          <img src={`http://localhost:8000/${filme.imagem}`} />
                        <div className="poster-placeholder">
                          <i className="ti ti-movie poster-icon"></i>
                        </div>

                        <div className="views-badge">
                          <i className="ti ti-eye icon-eye"></i>
                          100
                        </div>

                        <div className="badge">
                          <i className="ti ti-star icon-star"></i>
                          6.7
                        </div>

                        <span className="genre-tag">{filme.genero}</span>
                      </div>

                      <div className="card-title">{filme.titulo}</div>
                      <div className="card-meta">{filme.lancamento}</div>

                      <div className="card-director">
                        <i className="ti ti-user icon-user"></i>
                        <span>{filme.diretor.map((diretor)=>diretor.nome).join(", ")}</span>
                      </div>
                    </div>

              ))

          }
      </div>

)
}

export default List