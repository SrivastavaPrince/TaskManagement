import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { logout } from "../redux/authSlice";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login"); // Redirect if not logged in
    fetchTasks();
  }, [user, search, status, priority]); // ✅ Refetch when filters change

  const fetchTasks = async () => {
    try {
      let query = `/tasks?search=${search}&status=${status}&priority=${priority}`;
      const { data } = await API.get(query);
      setTasks(data);
    } catch (error) {
      console.error(
        "Error fetching tasks:",
        error.response?.data?.message || error
      );
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data?.message || error
      );
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        {/* 🔹 Header with Logout */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="text-primary fw-bold">Task Manager</h1>
          {user && (
            <div className="d-flex gap-3 align-items-center">
              <span className="text-dark fw-semibold">
                Welcome, {user.username}!
              </span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>
            </div>
          )}
        </div>

        {/* 🔹 Search & Filters */}
        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* 🔹 Add Task Button */}
        <div className="text-end mb-3">
          <button
            onClick={() => navigate("/add-task")}
            className="btn btn-primary"
          >
            <i className="bi bi-plus-lg"></i> Add Task
          </button>
        </div>

        {/* 🔹 Task List */}
        <div>
          {tasks.length === 0 ? (
            <p className="text-muted text-center fs-5">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="card mb-3 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-dark fw-bold">{task.title}</h3>
                  <p className="card-text">{task.description}</p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-info">{task.status}</span>
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span className="badge bg-danger">{task.priority}</span>
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-task/${task._id}`)}
                      className="btn btn-warning btn-sm"
                    >
                      <i className="bi bi-pencil-fill"></i> Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-trash-fill"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
