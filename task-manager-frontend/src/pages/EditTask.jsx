import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const { data } = await API.get(`/tasks/${id}`);
      setTask(data);
    } catch (error) {
      console.error(
        "Error fetching task:",
        error.response?.data?.message || error
      );
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${id}`, task);
      navigate("/");
    } catch (error) {
      console.error(
        "Error updating task:",
        error.response?.data?.message || error
      );
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <form
        className="bg-white p-4 rounded shadow-lg w-50"
        onSubmit={handleUpdateTask}
      >
        <h2 className="text-center text-warning fw-bold mb-4">Edit Task</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Task Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            placeholder="Task Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Priority</label>
          <select
            className="form-select"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Status</label>
          <select
            className="form-select"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="btn btn-warning w-100 fw-bold">
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
