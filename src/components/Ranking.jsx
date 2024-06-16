import { useEffect, useState } from "react";
import { db } from '../api/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Ranking.css';

export default function Ranking() {
  const [pontos, setPontos] = useState([]);

  useEffect(() => {
    fetchUserPoints();
  }, []);

  async function fetchUserPoints() {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshots = await getDocs(usersCollection);

      let usersData = usersSnapshots.docs.map(doc => ({
        id: doc.id,
        name: doc.data().email,
        points: doc.data().pontos
      }));

      usersData.sort((a, b) => b.points - a.points);

      setPontos(usersData);
    } catch (error) {
      console.error("Erro ao buscar pontos dos usuários:", error);
    }
  }

  return (
    <div className="ranking-container">
      <h1 className="ranking-title">Ranking de Pontuações</h1>
      <ul className="ranking-list">
        {pontos.map((score, index) => (
          <li key={index} className="ranking-item">
            <span className="ranking-position">{index + 1}.</span>
            <span className="ranking-name">{score.name}</span>
            <span className="ranking-score">{score.points}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
