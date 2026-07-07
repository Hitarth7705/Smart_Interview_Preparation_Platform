import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SRSPractice.css';

function SRSStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/srs/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="srs-container">Loading...</div>;

  if (!stats) return <div className="srs-container">No data available</div>;

  return (
    <div className="srs-container">
      <h1>SRS Statistics</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Cards</h3>
          <p className="stat-value">{stats.totalCards}</p>
        </div>

        <div className="stat-card">
          <h3>New Cards</h3>
          <p className="stat-value new">{stats.newCards}</p>
        </div>

        <div className="stat-card">
          <h3>Learning Cards</h3>
          <p className="stat-value learning">{stats.learningCards}</p>
        </div>

        <div className="stat-card">
          <h3>Review Cards</h3>
          <p className="stat-value review">{stats.reviewCards}</p>
        </div>

        <div className="stat-card">
          <h3>Total Reviews</h3>
          <p className="stat-value">{stats.totalReviews}</p>
        </div>

        <div className="stat-card">
          <h3>Avg Easiness</h3>
          <p className="stat-value">{stats.averageEasinessFactor?.toFixed(2)}</p>
        </div>
      </div>

      <button className="btn-primary" onClick={() => window.location.href = '/srs-practice'}>
        Start Practicing
      </button>
    </div>
  );
}

export default SRSStats;