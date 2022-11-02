import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import clsx from "clsx";
import style from "../../../style.module.scss";
import SnipAvatar from "./Avatar";
import ReactQuill from "react-quill";
import { v4 as uuid } from "uuid";

export interface ArticleFormProps {
  data: any | undefined;
  setArr: Function;
  arr: Array<any> | Array<void>;
  setModalOpen: Function;
}

const ArticleForm = ({ arr, data, setArr, setModalOpen }: ArticleFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  return (
    <Form
      onFinish={(value) => {
        const outPut = {
          ...value,
        };
        if (value.image) {
          outPut.image = value.image.id
            ? value.image
            : value?.image?.file.response.data;
        }
        if (!data) {
          outPut.id = uuid();
          if (arr) {
            setArr("articles", [outPut, ...arr]);
          }
          if (!arr) {
            setArr("articles", [outPut]);
          }
        }
        if (data) {
          outPut.id = data.id;
          setArr(
            "articles",
            arr.map((item) => {
              if (item.id === data.id) {
                return outPut;
              } else {
                return item;
              }
            })
          );
        }
        setModalOpen(false);
      }}
      form={form}
      className={clsx(style.form)}
      layout="inline"
    >
      <div className={clsx(style.titleWraper, "d-flex")}>
        <Form.Item name="title" label="Tiêu đề" className={clsx(style.formDes)}>
          <Input />
        </Form.Item>
        <SnipAvatar data={data?.image} />
        <Form.Item
          name="subTitle"
          label="Tiêu đề phụ"
          className={clsx(style.formDes)}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          className={clsx(style.formDes)}
        >
          <Input />
        </Form.Item>
      </div>
      <Form.Item
        className={clsx(style.formItem)}
        key={uuid()}
        label="Nội dung"
        name="content"
      >
        <ReactQuill theme="snow" className={clsx(style.quill)}></ReactQuill>
      </Form.Item>
      <Form.Item className={clsx(style.submit)}>
        <Button htmlType="submit" type="primary">
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default ArticleForm;
