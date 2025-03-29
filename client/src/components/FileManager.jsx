import React, { useState } from "react";
import { fileService } from "../services/fileService.js";
import { useParams } from "react-router-dom";
import AssignmentGeneratorPopup from "./AssignmentGeneratorPopup";
const FileManager = ({ files, setFiles, activeFile, setActiveFile }) => {
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [showAssignmentPopup, setShowAssignmentPopup] = useState(false); // New state for popup
  const [fileToDelete, setFileToDelete] = useState(null);
  const params = useParams();
  const workspaceId = params.id;

  const handleFileAdd = async () => {
    if (!newFileName) return;

    try {
      const extension = newFileName.split(".").pop().toLowerCase();
      const languageMap = {
        js: "javascript",
        py: "python",
        cpp: "cpp",
        c: "c",
        java: "java",
      };
      const language = languageMap[extension] || "javascript";

      const fileData = {
        name: newFileName,
        workspaceId: workspaceId,
        content: "",
        language: language,
      };

      console.log("Creating new file:", { name: newFileName, extension, language });

      const response = await fileService.createFile(fileData);
      setFiles((prev) => [...prev, response]);
      setActiveFile(response);
      setError(null);
      setShowAddModal(false);
      setNewFileName("");
    } catch (error) {
      console.error("Error creating file:", error);
      setError(error.message);
    }
  };

  const handleFileClick = (file) => {
    if (activeFile?._id !== file._id) {
      setActiveFile(file);
    }
  };

  const handleFileDelete = async () => {
    if (!fileToDelete) return;

    try {
      await fileService.deleteFile(fileToDelete._id);
      setFiles((prev) => {
        const newFiles = prev.filter((f) => f._id !== fileToDelete._id);
        setActiveFile(newFiles[0] || null);
        return newFiles;
      });
      setError(null);
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.message);
    }
  };

  return (
    <div className="w-72 bg-tertiary p-5 flex flex-col shadow-lg border-r border-quaternary">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-teal">Files</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal text-background px-3 py-1 rounded-lg hover:bg-hover-teal transition-colors duration-200 text-sm font-semibold shadow-md"
          >
            + New
          </button>
          <button
            onClick={() => setShowAssignmentPopup(true)}
            className="bg-yellow text-background px-3 py-1 rounded-lg hover:bg-hover-yellow transition-colors duration-200 text-sm font-semibold shadow-md"
          >
            Download Assignment
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-octonary bg-quaternary p-2 rounded-lg mb-4 text-sm border border-hover-teal animate-slide-in">
          {error}
        </div>
      )}

      {/* File List */}
      <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-quinary scrollbar-track-background">
        {files.length === 0 ? (
          <p className="text-senary text-sm text-center">No files yet. Add one!</p>
        ) : (
          files.map((file) => (
            <div
              key={file._id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                activeFile?._id === file._id
                  ? "bg-teal text-background"
                  : "bg-quaternary text-octonary hover:bg-tertiary"
              }`}
              onClick={() => handleFileClick(file)}
            >
              <span className="truncate max-w-[180px] text-sm">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFileToDelete(file);
                  setShowDeleteModal(true);
                }}
                className={`text-sm ${
                  activeFile?._id === file._id
                    ? "text-background hover:text-hover-yellow"
                    : "text-quaternary hover:text-hover-teal"
                } transition-colors duration-200`}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add File Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-tertiary p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold text-teal mb-4">Create New File</h3>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g., test.js, test.py, test.cpp"
              className="w-full px-4 py-3 bg-quaternary text-octonary border border-senary rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewFileName("");
                }}
                className="bg-quaternary text-octonary px-4 py-2 rounded-lg hover:bg-tertiary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFileAdd}
                className="bg-teal text-background px-4 py-2 rounded-lg hover:bg-hover-teal transition-colors duration-200"
                disabled={!newFileName}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete File Modal */}
      {showDeleteModal && fileToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-tertiary p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold text-teal mb-4">Delete File</h3>
            <p className="text-senary mb-4">
              Are you sure you want to delete <span className="text-octonary font-medium">{fileToDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setFileToDelete(null);
                }}
                className="bg-quaternary text-octonary px-4 py-2 rounded-lg hover:bg-tertiary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFileDelete}
                className="bg-yellow text-background px-4 py-2 rounded-lg hover:bg-hover-yellow transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showAssignmentPopup && (
        <AssignmentGeneratorPopup
          files={files}
          workspaceId={workspaceId}
          onClose={() => setShowAssignmentPopup(false)}
        />
      )}
    </div>
  );
};

export default FileManager;