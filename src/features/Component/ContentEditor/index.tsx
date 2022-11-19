import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import useDebounce from "../Debounce";
import { call } from "redux-saga/effects";
import { callApi } from "../../../Api/Axios";
import getCookie from "../../../Api/getCookie";
export interface ContentEditorProps {
  content: any;
  setContent: Function;
}

const ContentEditor = ({ content, setContent }: ContentEditorProps) => {
  const html: any = htmlToDraft(content);
  const [text, setText] = useState(
    EditorState.createWithContent(ContentState.createFromBlockArray(html))
  );

  useEffect(() => {
    setContent("content", draftToHtml(convertToRaw(text.getCurrentContent())));
  }, [useDebounce(text, 500)]);
  return (
    <>
      <Editor
        editorState={text}
        editorClassName="editor"
        onEditorStateChange={(e) => {
          setText(e);
        }}
        toolbar={{
          image: {
            previewImage: true,
            uploadEnabled: true,
            uploadCallback: async (e) => {
              const formData = new FormData();
              formData.append("file", e);
              const cookie = getCookie("token");
              const res = await callApi
                .post("/v1/asset/upload", formData, {
                  headers: { Authorization: cookie },
                })
                .then((response) => response.data)
                .catch((err) => console.log(err));

              if (res.status === 1) {
                return new Promise((resolve, reject) => {
                  resolve({
                    data: { file: res.data.path, link: res.data.path },
                  });
                });
              }

              if (res.status === 0) {
                return new Promise((resolve, reject) => {
                  console.error("error", res.status);
                  resolve({
                    data: {
                      link: res.errors,
                    },
                  });
                });
              }
            },
          },
        }}
      ></Editor>
    </>
  );
};
export default ContentEditor;
