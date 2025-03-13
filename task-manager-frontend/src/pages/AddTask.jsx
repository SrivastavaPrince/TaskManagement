import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const navigate = useNavigate();

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title, description, priority });
      navigate("/"); // Redirect to tasks
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response?.data?.message || error
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleAddTask}
        className="bg-white p-4 rounded shadow-lg w-25"
      >
        <h2 className="text-center text-primary fw-bold mb-4">Add Task</h2>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
            rows={3}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success w-100">
          <i className="bi bi-plus-circle"></i> Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
