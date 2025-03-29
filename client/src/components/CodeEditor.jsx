import React, { useState, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useMutation, useStorage } from "@liveblocks/react";
import { fileService } from "../services/fileService";
import debounce from "lodash/debounce";

const CodeEditor = ({ file, settings, onFileChange , isTestMode = false}) => {
  const [saveStatus, setSaveStatus] = useState("");
  const [editorContent, setEditorContent] = useState(file?.content || "");

  const storageContent = useStorage((root) => root?.content);
  const updateContent = useMutation(({ storage }, newContent) => {
    if (storage) {
      storage.set("content", newContent);
    }
  }, []);

  const debouncedSave = useCallback(
    debounce(async (fileData) => {
      if (isTestMode) return;
      try {
        setSaveStatus("Saving...");
        const updatedFile = await fileService.updateFile(fileData._id, fileData);
        if (onFileChange) {
          onFileChange(updatedFile);
        }
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (error) {
        console.error("Auto-save error:", error);
        setSaveStatus("Save failed!");
      }
    }, 1000),
    []
  );

  const handleChange = useCallback(
    (newContent) => {
      if (!onFileChange || !file) return;
      setEditorContent(newContent);

      if (file) {
        const updatedFile = {
          ...file,
          content: newContent,
        };
        onFileChange(updatedFile);
        if (!isTestMode) debouncedSave(updatedFile);
        try {
          updateContent(newContent);
        } catch (error) {
          console.warn("Liveblocks storage not ready:", error);
        }
      }
    },
    [file, onFileChange, updateContent, debouncedSave]
  );

  useEffect(() => {
    if (file?.content !== undefined) {
      setEditorContent(file.content);
      try {
        updateContent(file.content);
      } catch (error) {
        console.warn("Liveblocks storage not ready:", error);
      }
    }
  }, [file?._id, file?.content]);

  return (
    <div className="flex flex-col h-full relative bg-tertiary">
      <div className="flex justify-between items-center p-3 bg-quaternary border-b border-senary">
        <span className="text-octonary font-medium truncate max-w-[70%]">
          {file?.name || "No file selected"}
        </span>
        {!isTestMode && saveStatus && (
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${
              saveStatus === "Saved"
                ? "text-teal bg-background"
                : saveStatus === "Save failed!"
                ? "text-yellow bg-background"
                : "text-senary bg-background"
            }`}
          >
            {saveStatus}
          </span>
        )}
      </div>
      <div className="relative flex-1 min-h-0">
        <Editor
          height="100%"
          theme={settings.theme}
          language={file?.language || "javascript"}
          value={editorContent}
          onChange={handleChange}
          options={{
            fontSize: settings.fontSize,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 10, bottom: 10 },
          }}
          className="border-t border-quaternary"
        />
      </div>
    </div>
  );
};

export default CodeEditor;