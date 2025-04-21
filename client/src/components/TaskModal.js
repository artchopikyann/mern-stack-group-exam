import React, { useState } from "react";

function TaskModal({ isOpen, onClose, userId }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        creationDay: "",
        deadline: "",
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("creationDay", formData.creationDay);
        form.append("deadline", formData.deadline);
        form.append("userId", userId); 
        if (formData.file) {
            form.append("file", formData.file);
        }

        try {
            const response = await fetch("http://localhost:5000/tasks", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: form,
            });

            const result = await response.json();
            console.log(result);

            if (response.ok) {
                alert("Task created successfully");
                onClose(); 
            } else {
                alert(result.message || "Failed to create task");
            }
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Create Task for User</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                        required
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                        required
                    />

                    <label>Creation Day:</label>
                    <input
                        type="date"
                        name="creationDay"
                        value={formData.creationDay}
                        onChange={handleChange}
                    />

                    <label>Deadline:</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />

                    <label>File:</label>
                    <input
                        style={{ display: 'block' }}
                        type="file"
                        name="file"
                        onChange={handleChange}
                    />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TaskModal;
