import React, { useState } from 'react';

function UserTaskModal({
    isOpen,
    onClose,
    editTaskId,
    updateTask,
    addTask,
    file,
    setFile,
    setStatus
}) {
    const [fileError, setFileError] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const validFileTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(111, selectedFile);
        
        if (!selectedFile) return;

        if (!validFileTypes.includes(selectedFile.type)) {
            setFileError(true);
            return;
        }

        setFileError(false);
        setFile(selectedFile);
        setStatus("completed");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);  
    };

    const handleDragLeave = () => {
        setDragOver(false);  
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);  
        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) return;

        if (!validFileTypes.includes(droppedFile.type)) {
            setFileError(true);
            return;
        }

        setFileError(false);
        setFile(droppedFile);
        setStatus("completed");
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!file || fileError) return;  

        if (editTaskId) {
            updateTask(e);
        } else {
            addTask(e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>

                <form onSubmit={handleFormSubmit} className="form-container">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => document.getElementById("hiddenFileInput").click()}
                        className={`file-input ${dragOver ? 'drag-over' : ''}`}
                    >
                        {file ? (
                            <p className="fileinput-text">
                                <img src="/images/file.png" alt="file" style={{ width: "25px" }} />
                                {file.name}
                            </p>
                        ) : (
                            <p className="fileinput-text">Drop a file or click to select one</p>
                        )}
                        <input
                            type="file"
                            id="hiddenFileInput"
                            className="file-input"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept=".pdf,.png,.jpg,.jpeg,.docx"
                        />
                    </div>

                    {fileError && (
                        <p className="error-text">You can only upload PDF or PNG files.</p>
                    )}

                    {file && (
                        <div id="fileName" className="file-name">
                            <p className="fileinput-text">
                                <img src="/images/file.png" alt="file" style={{ width: "25px" }} />
                                {file.name}
                            </p>
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={!file || fileError}>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserTaskModal;
