import { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../api/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import CreatePost from './CreatePost';
import './PostList.css';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    try {
      const apiResponse = axios.get('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=noticia&qtd=5');
      const postsCollection = collection(db, "posts");
      const postsSnapshots = getDocs(postsCollection);

      const [apiResult, postsResult] = await Promise.all([apiResponse, postsSnapshots]);
      const noticias = apiResult.data.items;

      const postsData = postsResult.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));  
      setPosts([...noticias, ...postsData]);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function handleCreatePost(title, introduction) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        titulo: title,
        introducao: introduction
      });

      setPosts((prevPosts) => [
        ...prevPosts, { id: docRef.id, titulo: title, introducao: introduction },
      ]);
    } catch (e) {
      console.error("Erro ao adicionar este dado: ", e);
    }
  }

  return (
    <div>
      <CreatePost onCreatePost={handleCreatePost} />
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <h2>{post.titulo}</h2>
            <p>{post.introducao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
