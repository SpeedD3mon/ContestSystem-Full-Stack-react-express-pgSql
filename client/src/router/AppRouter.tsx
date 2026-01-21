import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Contests from "../pages/Contests";
import ContestPlay from "../pages/ContestPlay";
import Leaderboard from "../pages/Leaderboard";
import History from "../pages/History";
import Admin from "../pages/Admin";
import AddQuestions from "../pages/AddQuestions";


import ProtectedRoute from "../auth/ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard/>}/>
        <Route path="/contests" element={<Contests/>}/>
        <Route element={<ProtectedRoute roles={['signed-in','vip','admin']}/>}>
            <Route path="/contest/:id" element={<ContestPlay/>}/>
            <Route path="/history" element={<History/>}/>
        </Route>

        <Route element={<ProtectedRoute roles={['admin']}/>}>
            <Route path="/admin" element={<Admin/>}/>
             <Route path="/admin/:id/questions" element={<AddQuestions/>}/>
            
        </Route>
    </Routes>
  );
};

export default AppRouter;
