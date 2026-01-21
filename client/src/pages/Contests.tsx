import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

interface Contest {
  contest_id: number;
  name: string;
  access_level: "normal" | "vip";
  prize: string;
  starts_at?: string;
  ends_at?: string;
  is_active?: boolean;
}

const Contests: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [playable, setPlayable] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        if (!currentUser) return;

        const res = await api.get<Contest[]>("/contests/playable");
        setPlayable(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [currentUser]);

  if (loading) return <div>Loading contests...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!currentUser) return (
    <div>
      Please log in to see playable contests. <Link to="/">Back to Home</Link>
    </div>
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎯 Contests You Can Play</h1>
      {playable.length === 0 ? (
        <p>No contests available for your role.</p>
      ) : (
        <ul>
          {playable.map((c) => (
            <li key={c.contest_id} style={{ marginBottom: "1rem" }}>
              <strong>{c.name}</strong> ({c.access_level}) - Prize: {c.prize}
              <br />
              <button
                onClick={() => navigate(`/contest/${c.contest_id}`)}
                style={{ marginTop: "0.5rem" }}
              >
                Enter Contest
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default Contests;
