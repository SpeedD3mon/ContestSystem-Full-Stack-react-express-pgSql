import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Home = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎯 Contest System - Home</h1>
      {currentUser ? (
        <div>
          <p>
            Logged in as: {currentUser.user.email} ({currentUser.user.role})
          </p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <Link to="/login">Go to Login</Link>
        <br />
        <Link to="/contests">View Contests</Link>
        <br />
        <Link to="/leaderboard">Leaderboard</Link>
        <br />
        <Link to="/history">History</Link>
        <br />
        <Link to="/admin">Admin Page</Link>
      </div>
    </div>
  );
};

export default Home;
