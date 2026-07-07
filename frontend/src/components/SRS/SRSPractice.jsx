import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SRSPractice.css';

function SRSPractice() {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [quality, setQuality] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDueCards();
  }, []);

  const fetchDueCards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/srs/due-cards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(response.data.cards);
      setStats(response.data.stats);
      if (response.data.cards.length > 0) {
        setCurrentCard(response.data.cards[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoading(false);
    }
  };

  const submitAnswer = async (qualityScore) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/srs/review/${currentCard._id}`,
        {
          quality: qualityScore,
          userAnswer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move to next card
      const nextCards = cards.slice(1);
      setCards(nextCards);
      setUserAnswer('');
      setQuality(null);

      if (nextCards.length > 0) {
        setCurrentCard(nextCards[0]);
      } else {
        alert('Great! You completed all due cards today! 🎉');
        fetchDueCards();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (loading) return <div className="srs-container">Loading...</div>;

  if (!currentCard) {
    return (
      <div className="srs-container">
        <h2>No cards due today! 🎉</h2>
        <p>Come back tomorrow for more practice.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="srs-container">
      <div className="srs-stats">
        <h3>Today's Progress</h3>
        <p>New: {stats.newCards} | Learning: {stats.learningCards} | Review: {stats.reviewCards}</p>
        <p>Cards remaining: {cards.length}</p>
      </div>

      <div className="srs-card">
        <h2>Question {currentCard.questionId}</h2>
        <p className="question-text">{currentCard.question}</p>

        <div className="user-answer-section">
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Write your answer here..."
            rows="6"
          />
        </div>

        <div className="quality-buttons">
          <button
            className="quality-btn q0"
            onClick={() => submitAnswer(0)}
            title="Complete blackout"
          >
            ❌ No Idea (0)
          </button>
          <button
            className="quality-btn q1"
            onClick={() => submitAnswer(1)}
            title="Incorrect, but know answer"
          >
            😕 Incorrect (1)
          </button>
          <button
            className="quality-btn q2"
            onClick={() => submitAnswer(2)}
            title="Incorrect, remember answer"
          >
            🤔 Unsure (2)
          </button>
          <button
            className="quality-btn q3"
            onClick={() => submitAnswer(3)}
            title="Correct after difficulty"
          >
            👍 Correct (3)
          </button>
          <button
            className="quality-btn q4"
            onClick={() => submitAnswer(4)}
            title="Correct with difficulty"
          >
            ✨ Very Good (4)
          </button>
          <button
            className="quality-btn q5"
            onClick={() => submitAnswer(5)}
            title="Perfect response"
          >
            🔥 Perfect (5)
          </button>
        </div>
      </div>
    </div>
  );
}

export default SRSPractice;