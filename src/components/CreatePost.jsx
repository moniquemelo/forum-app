import  { useState } from 'react';
import './CreatePost.css';

export default function CreatePost({ onCreatePost }) { // Sempre que eu usar este componente em outro lugar, ele vai pedir o onCreatePost
  const [title, setTitle] = useState('');
  const [introduction, setintroduction] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    onCreatePost(title, introduction);
    setTitle('');
    setintroduction('');
  }

  return (
    <form className="form-create-post" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <textarea
        value={introduction}
        onChange={(e) => setintroduction(e.target.value)}
        placeholder="O que você gostaria de perguntar ou compartilhar?"
      />
      <button type="submit">Criar Post</button>
    </form>
  );
}
