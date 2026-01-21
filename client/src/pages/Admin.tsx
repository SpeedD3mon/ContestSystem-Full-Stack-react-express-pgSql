import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

interface Contest {
  contest_id: number;
  name: string;
  description: string;
  access_level: "normal" | "vip";
  prize: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

const Admin: React.FC = () => {
  const { currentUser } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContest, setNewContest] = useState({
    name: "",
    description: "",
    access_level: "normal",
    prize: "",
    starts_at: "",
    ends_at: ""
  });

  const fetchContests = async () => {
    setLoading(true);
    try {
      const res = await api.get<Contest[]>("/admin/contests");
      setContests(res.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error fetching contests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleStart = async (contestId: number) => {
    try {
      await api.post(`/admin/contests/${contestId}/start`);
      alert("Contest started!");
      fetchContests();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error starting contest");
    }
  };

  const handleCreate = async () => {
    if (!newContest.name || !newContest.starts_at || !newContest.ends_at) {
      return alert("Please fill all required fields");
    }

    try {
      await api.post("/admin/contests", newContest);
      alert("Contest created!");
      setNewContest({
        name: "",
        description: "",
        access_level: "normal",
        prize: "",
        starts_at: "",
        ends_at: ""
      });
      fetchContests();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Error creating contest");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>

      <h2>Create New Contest</h2>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Contest Name"
          value={newContest.name}
          onChange={(e) => setNewContest({ ...newContest, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newContest.description}
          onChange={(e) => setNewContest({ ...newContest, description: e.target.value })}
        />
        <select
          value={newContest.access_level}
          onChange={(e) => setNewContest({ ...newContest, access_level: e.target.value })}
        >
          <option value="normal">Normal</option>
          <option value="vip">VIP</option>
        </select>
        <input
          type="text"
          placeholder="Prize"
          value={newContest.prize}
          onChange={(e) => setNewContest({ ...newContest, prize: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={newContest.starts_at}
          onChange={(e) => setNewContest({ ...newContest, starts_at: e.target.value })}
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={newContest.ends_at}
          onChange={(e) => setNewContest({ ...newContest, ends_at: e.target.value })}
        />
        <button onClick={handleCreate}>Create Contest</button>
      </div>

      <h2 style={{ marginTop: "2rem" }}>All Contests</h2>
      {loading ? (
        <p>Loading contests...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Access</th>
              <th>Prize</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((c) => (
              <tr key={c.contest_id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{c.name}</td>
                <td>{c.access_level}</td>
                <td>{c.prize}</td>
                <td>{new Date(c.starts_at).toLocaleString()}</td>
                <td>{new Date(c.ends_at).toLocaleString()}</td>
                <td>{c.is_active ? "Active" : "Inactive"}</td>
                <td>
                  {!c.is_active && (
                    <>
                      <button onClick={() => handleStart(c.contest_id)}>Start</button>{" "}
                      <Link to={`/admin/${c.contest_id}/edit`}>
                        <button>Edit</button>
                      </Link>{" "}
                      <Link to={`/admin/${c.contest_id}/questions`}>
                        <button>Add Questions</button>
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
