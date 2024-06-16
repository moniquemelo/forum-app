import { useEffect, useState } from 'react';
import axios from 'axios';
import { db } from '../api/firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import './PostList.css';

export default function PostList() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  // Preciso que ele olhe a situação do login do usuário, mas não sei se fazer dessa forma é a melhor.
  useEffect(() => {
    if (currentUser) {
      addUserToDataBase(currentUser);
    }
    getPosts();
  }, [currentUser]);

  // Adicionando um usuário no database e inicializando ele com a pontuação zero. Preciso verificar depois se será necessário fazer dessa forma ou se
  // o ideal é adicionar uma subcoleção dentro dos documentos da colecao posts.
  async function addUserToDataBase(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        pontos: 0
      });
    }
  }

  async function getPosts() {
    try {
      const apiResponse = await axios.get('https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=noticia&qtd=3');
      const noticias = apiResponse.data.items;

      const postsCollection = collection(db, "posts");
      const postsSnapshots = await getDocs(postsCollection);

      let postsData = postsSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Pequena verificação sobre o usuário estar logado ou não. Revisar no final do projeto para otimizar esse trecho de código.
      if (!currentUser) {
        setShowLoginMessage(true);
      } else {
        setShowLoginMessage(false);
      }

      for (const noticia of noticias) {
        const existingPost = postsData.find(post => post.titulo === noticia.titulo); // Validando a existencia do post pelo titulo. É o ideal?

        if (!existingPost) {
          const docRef = await addDoc(postsCollection, {
            titulo: noticia.titulo,
            introducao: noticia.introducao,
            curtidas: 0,
            comentario: [],
            pontos: 0
          });

          const newPost = {
            id: docRef.id,
            titulo: noticia.titulo,
            introducao: noticia.introducao,
            curtidas: 0,
            comentario: [],
            pontos: 0
          };

          postsData.push(newPost);
        }
      }

      postsData.sort((a, b) => {
        if (b.curtidas !== a.curtidas) {
          return b.curtidas - a.curtidas;
        }
        return b.comentario.length - a.comentario.length;
      });

      setPosts(postsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  async function handleLikePost(id, currentLikes) {
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        curtidas: currentLikes + 1
      });

      const newPosts = posts.map(post =>
        post.id === id ? { ...post, curtidas: currentLikes + 1 } : post
      );

      setPosts(newPosts);
      await updateUserPoints(currentUser.uid, 1); 
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
    }
  }

  async function handleCommentSubmit(e, postId) {
    e.preventDefault();

    // if (!currentUser) {
    //   setShowLoginMessage(true);
    //   return;
    // }

    try {
      const commentText = e.target.commentText.value;

      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        console.error(`Post com ID ${postId} não encontrado.`);
        return;
      }

      const currentComments = postSnap.data().comentario || [];
      const newComments = [...currentComments, { usuario: currentUser.email, texto: commentText }];

      await updateDoc(postRef, {
        comentario: newComments
      });

      e.target.commentText.value = '';

      
      const newPosts = posts.map(post =>
        post.id === postId ? { ...post, comentario: newComments } : post
      );
      setPosts(newPosts);

      await updateUserPoints(currentUser.uid, 2);

    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  }

  async function handleCreatePost(title, introduction) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        titulo: title,
        introducao: introduction,
        curtidas: 0,
        comentario: [],
        pontos: 0
      });

      const newPost = {
        id: docRef.id,
        titulo: title,
        introducao: introduction,
        curtidas: 0,
        comentario: [],
        pontos: 0
      };

      setPosts(prevPosts => [...prevPosts, newPost]);
      await updateUserPoints(currentUser.uid, 3); 
    } catch (error) {
      console.error("Erro ao adicionar o post:", error);
    }
  }

  async function updateUserPoints(userId, points) {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const currentPoints = userSnapshot.data().pontos || 0;
      await updateDoc(userRef, {
        pontos: currentPoints + points
      });
    } else {
      await setDoc(userRef, {
        pontos: points
      });
    }
  }

  return (
    <div>
      {showLoginMessage && (
        <div className="message-to-register">
          <p>Você precisa estar logado para interagir com os posts e ganhar badges exclusivos como premiação pelo seu engajamento</p>
        </div>
      )}
      {/* <CreatePost onCreatePost={handleCreatePost} /> */}
      <div className="post-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <h2>{post.titulo}</h2>
            <p>{post.introducao}</p>
            {currentUser && (
              <div className="comments-section">
                {post.comentario && post.comentario.length > 0 ? (
                  post.comentario.map((comment, index) => (
                    <p key={index}><strong>{comment.usuario}:</strong> {comment.texto}</p>
                  ))
                ) : (
                  <p>Seja o primeiro a comentar!</p>
                )}
                
                <button onClick={() => handleLikePost(post.id, post.curtidas)}>Curtir ({post.curtidas})</button>
                <form onSubmit={(e) => handleCommentSubmit(e, post.id)}>
                  <input
                    type="text"
                    name="commentText"
                    placeholder="Deixe um comentário"
                  />
                  <button type="submit">Comentar</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

