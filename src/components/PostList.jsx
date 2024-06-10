import { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css'; 

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=noticia&qtd=5')
      .then(response => {
        const noticias = response.data.items; 
        setPosts(noticias);
      })
      .catch(error => {
        console.error("Erro ao buscar dados da API:", error);
      });
  }, []);

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h2>{post.titulo}</h2>
          <p>{post.introducao}</p>
        </div>
      ))}
    </div>
  );
}
