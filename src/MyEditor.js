import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = window.localStorage.getItem("editorContent");
    if (savedContent) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      );
    }
  }, []);

  const customStyleMap = {
    RED_LINE: {
      color: "red",
    },
    UNDERLINE: {
      color: "black",
      textDecoration: "underline",
    },
  };

  const onChange = (state) => {
    const content = state.getCurrentContent();
    const selection = state.getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentBlock = content.getBlockForKey(anchorKey);
    const text = currentBlock.getText();

    if (text.startsWith("# ")) {
      const newContentState = Modifier.removeRange(
        content,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        state,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
    } else if (text.startsWith("* ")) {
      const newContentState = Modifier.removeRange(
        content,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        state,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
    } else if (text.startsWith("** ")) {
      const newContentState = Modifier.removeRange(
        content,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "backward"
      );

      const newEditorState = EditorState.push(
        state,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED_LINE"));
    } else if (text.startsWith("*** ")) {
      const newContentState = Modifier.removeRange(
        content,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 4,
        }),
        "backward"
      );
      const newEditorState = EditorState.push(
        state,
        newContentState,
        "remove-range"
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
    } else {
      setEditorState(state);
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    window.localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    alert("Content Saved!");
  };

  return (
    <div style={{ padding: "10px", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <h4 style={{ textAlign: "center" }}>
          Demo Editor by Avinash Chandra Mishra
        </h4>
        <button
          style={{
            height: "25px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)",
          }}
          onClick={saveContent}
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <div
        style={{ border: "2px solid blue", padding: "20px", minHeight: "80vh" }}
      >
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={onChange}
          customStyleMap={customStyleMap}
          placeholder="Enter your Text Here..."
        />
      </div>
    </div>
  );
};

export default MyEditor;
