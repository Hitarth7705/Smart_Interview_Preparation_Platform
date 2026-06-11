import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={{ margin: 0 }}>Smart Interview Prep</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.container}>
        <h2>Welcome to Dashboard 🎉</h2>

        {/* Stats Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Problems Solved</h3>
            <p style={styles.cardValue}>120</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Mock Interviews</h3>
            <p style={styles.cardValue}>5</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Streak</h3>
            <p style={styles.cardValue}>10 Days</p>
          </div>
        </div>

        {/* Interview Questions Link Card */}
        <div style={styles.section}>
          <h3 style={{ margin: "0 0 12px" }}>📚 Interview Questions</h3>
          <p style={{ margin: "0 0 16px", color: "#555", fontSize: 14 }}>
            Practice 50 curated interview questions across JavaScript, React, Data Structures, Algorithms, and more.
          </p>
          <Link to="/questions" style={styles.questionsBtn}>
            Open Interview Questions →
          </Link>
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <h3>Recent Activity</h3>
          <ul>
            <li>Solved Two Sum</li>
            <li>Completed Mock Interview</li>
            <li>Solved Binary Search</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { margin: 0, fontFamily: "Arial, sans-serif", backgroundColor: "#f4f6f8", minHeight: "100vh" },
  navbar: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "14px",
  },
  container: { padding: "20px" },
  cards: { display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" },
  card: {
    flex: 1,
    minWidth: "150px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  cardTitle: { margin: 0, color: "#555", fontSize: "14px" },
  cardValue: { fontSize: "22px", fontWeight: "bold", margin: "8px 0 0" },
  section: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  questionsBtn: {
    display: "inline-block",
    padding: "10px 22px",
    background: "linear-gradient(135deg, #11998e, #38ef7d)",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "700",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(17,153,142,0.25)",
  },
};
