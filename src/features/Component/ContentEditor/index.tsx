import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
export interface ContentEditorProps {}

const ContentEditor = (props: ContentEditorProps) => {
  const [text, setText] = useState<any>(EditorState.createEmpty());

  return (
    <>
      <Editor
        editorState={text}
        onEditorStateChange={(e) => {
          setText(e);
        }}
      ></Editor>
    </>
  );
};
export default ContentEditor;
