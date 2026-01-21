import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

interface LeaderboardUser {
  user_id: number;
  username: string;
  role: string;
  total_score: number;
  rank: number;
}

interface Contest {
  contest_id: number;
  name: string;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<number | "global">("global");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noDataMessage, setNoDataMessage] = useState("");

  // 📥 Fetch contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get<Contest[]>("/contests");
        setContests(res.data);
      } catch (err) {
        console.error("Failed to load contests", err);
      }
    };
    fetchContests();
  }, []);

  // 📊 Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      setNoDataMessage("");

      try {
        const url =
          selectedContest === "global"
            ? "/leaderboard/global"
            : `/leaderboard/contest/${selectedContest}`;

        const res = await api.get(url);

        if (Array.isArray(res.data)) {
            if (res.data.length === 0) {
              setLeaderboard([]);
              setNoDataMessage("No attempts yet for this contest");
            } else {
              setLeaderboard(res.data);
            }
          } else {
            setLeaderboard([]);
            setNoDataMessage("No leaderboard data available");
          }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedContest]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🏆 Leaderboard</h1>

      {/* Contest selector */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Contest:{" "}
          <select
            value={selectedContest}
            onChange={(e) =>
              setSelectedContest(
                e.target.value === "global" ? "global" : Number(e.target.value)
              )
            }
          >
            <option value="global">🌍 Global</option>
            {contests.map((c) => (
              <option key={c.contest_id} value={c.contest_id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Loading / Error / Data */}
      {loading && <div>Loading leaderboard...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && leaderboard.length > 0 && (
        <ol>
          {leaderboard.map((user) => (
            <li key={user.user_id}>
              <b>#{user.rank}</b> {user.username} ({user.role}) — {user.total_score} pts
            </li>
          ))}
        </ol>
      )}

      {!loading && !error && leaderboard.length === 0 && (
        <div>{noDataMessage}</div>
      )}

      <br />
      <Link to="/contests">← Back to Contests</Link>
      <br />
      <Link to="/">← Back to Home</Link>
    </div>
  );
};

export default Leaderboard;
