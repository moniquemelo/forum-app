import React, { useState } from 'react';
import './CreatePost.css'; 

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ title, content });
  };

  return (
    <form className="form-create-post" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="O que você gostaria de perguntar ou compartilhar?"
      />
      <button type="submit">Criar Post</button>
    </form>
  );
}

