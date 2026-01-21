import { useEffect, useState } from "react";
import ButtonAction from "./ButtonAction";
import axios from "axios";

type WelcomeProps = {
  name?: string;
  subtitle?: string;
};
type User = {
  id: number;
  name: string;
  email: string;
};

export default function Welcome({
  name = "Guest",
  subtitle = "Glad you are here",
}: WelcomeProps): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getUsers() {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <section style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: "1.75rem", margin: "0.75rem 0" }}>
        Hello, {name} 👋
      </h2>
      <p style={{ marginTop: 0, color: "#374151" }}>{subtitle}</p>
      <div>
        <h1>List Of Users</h1>
        {loading && <p>Loading users...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <li key={u.id} style={{ marginBottom: "8px" }}>
              <strong>{u.name}</strong> — {u.email}
            </li>
          ))}
        </ul>

        <ButtonAction
          label="Refresh Users"
          onClick={getUsers}
          color="#3b82f6"
        />
      </div>
    </section>
  );
}
