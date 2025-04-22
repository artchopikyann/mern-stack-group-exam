import React, {useState} from 'react';

function UserTaskModal(
    isOpen,
    onClose,
    editTaskId,
    updateTask,
    addTask,
    file,
    setFile,
    handleFileChange,
    setStatus) {

    const [fileName, setFileName] = useState(false);

    return (
        <div>
            <div className="modal-overlay">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>
                    &times;
                </span>

                    <form onSubmit={editTaskId ? updateTask : addTask} className="form-container">

                        <div
                            onDrop={(e) => {
                                e.preventDefault();
                                setFile(e.dataTransfer.files[0]);
                                setStatus("completed");
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById("hiddenFileInput").click()}
                            className="file-input"
                        >
                            {file ? (
                                <p style={{alignItems: "center"}} className="fileinput-text">
                                    <img src='/images/file.png'
                                         alt='file'
                                         style={{width: "25px"}}/>{file.name}
                                </p>
                            ) : (
                                <p className="fileinput-text">Drop a file or click to select one</p>
                            )}
                            <input
                                type="file"
                                id="hiddenFileInput"
                                className="file-input"
                                style={{display: "none"}}
                                onChange={handleFileChange}
                                onClick={() => setFileName(true)}

                            />
                        </div>
                        {setFileName && (
                            <div id="fileName" className="file-name">
                                <p style={{alignItems: "center"}} className="fileinput-text">
                                    <img src='/images/file.png'
                                        alt='file'
                                        style={{width: "25px"}}/>{file?.name}
                                </p>
                            </div>
                        )}
                            <button type="submit" className="submit-btn">Submit</button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserTaskModal;