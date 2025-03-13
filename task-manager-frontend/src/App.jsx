import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
      </Routes>
    </Router>
  );
}

export default App;
