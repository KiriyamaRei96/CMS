import React from "react";
import clsx from "clsx";
import style from "../../../style.module.scss";
import { Avatar, Form, Input } from "antd";
import { v4 as uuid } from "uuid";
import ReactQuill from "react-quill";
import SnipAvatar from "./Avatar";
export interface SingleArticleProps {}

const SingleArticle = (props: SingleArticleProps) => {
  return (
    <>
      <div className={clsx(style.titleWraper, "d-flex")}>
        <Form.Item
          className={clsx(style.formDes)}
          key={uuid()}
          label={"Mô tả"}
          name={"description"}
        >
          <Input></Input>
        </Form.Item>
      </div>
      <Form.Item
        className={clsx(style.formItem)}
        key={uuid()}
        label='Nội dung'
        name='content'
      >
        <ReactQuill theme='snow' className={clsx(style.quill)}></ReactQuill>
      </Form.Item>
    </>
  );
};
export default SingleArticle;
