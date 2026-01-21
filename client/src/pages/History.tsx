import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

interface HistoryItem {
  contest_id: number;
  contest_name: string;
  score: number;
  prize: string | null;
  completed_at: string;
}

const History: React.FC = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser) return;

      try {
        const res = await api.get<HistoryItem[]>("/users/history"); // create this API
        setHistory(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (!currentUser) return <div>Please log in to view your history. <Link to="/">Back to Home</Link></div>;
  if (loading) return <div>Loading your contest history...</div>;
  if (error) return <div style={{ color: "red" }}>{error} <Link to="/">Back to Home</Link></div>;
  if (!history.length) return (
    <div style={{ padding: "2rem" }}>
      <h1>🏆 Your Contest History</h1>
      <div>You have not participated in any contests yet.</div>
      <br />
      <Link to="/contests">Back to Contests</Link>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🏆 Your Contest History</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Contest Name</th>
            <th>Score</th>
            <th>Prize</th>
            <th>Completed At</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.contest_id} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{item.contest_name}</td>
              <td>{item.score}</td>
              <td>{item.prize || "-"}</td>
              <td>{new Date(item.completed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/contests">Back to Contests</Link>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default History;
