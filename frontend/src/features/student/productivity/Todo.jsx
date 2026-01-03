import React from "react";
import "./todo.css";

const Todo = () => {
  return (
    <div className="todo-page">
      <div className="page-header">
        <h1>Todo</h1>
        <p>Manage your personal study tasks.</p>
      </div>

      <div className="empty-state">
        <p>No tasks added yet.</p>
      </div>
    </div>
  );
};

export default Todo;
