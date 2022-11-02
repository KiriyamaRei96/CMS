import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../../../style.module.scss";
import { Avatar, Button, Form, Input, Modal, Popconfirm, Table } from "antd";
import { v4 as uuid } from "uuid";
import ArticleForm from "./ArticleForm";

export interface MultiArticleProps {
  data: Array<object | void>;
}

const MultiArticle = ({ data }: MultiArticleProps) => {
  const [arr, setArr] = useState<any>(
    data.map((item) => ({ id: uuid(), ...item }))
  );
  const [form, setForm] = useState<any>();
  const [modalOpen, setModalOpen] = useState<any>();
  const collumns = [
    {
      title: "Tiêu đề thông tin",
      dataIndex: "title",
      key: uuid(),
      render: (text) => <span>{text ? text : "chưa có thông tin"}</span>,
    },
    {
      title: "Link thông tin",
      dataIndex: "link",
      key: uuid(),
      render: (text) => <span>{text ? text : "chưa có thông tin"}</span>,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            onConfirm={() => {
              setArr((prv) => prv.filter((item) => item.id !== record.id));
            }}
            title='Bạn muốn xóa thông tin này ?'
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button size='small'>Xóa</Button>
          </Popconfirm>
          <Button
            size='small'
            onClick={() => {
              console.log(record);
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={clsx(style.titleWraper, "d-flex")}>
        <Form.Item
          className={clsx(style.formDes)}
          key={uuid()}
          label={"Tiêu đề phụ"}
          name={"subTitle"}
        >
          <Input></Input>
        </Form.Item>

        <Form.Item
          className={clsx(style.formDes)}
          key={uuid()}
          label={"Link"}
          name={"link"}
        >
          <Input></Input>
        </Form.Item>
      </div>
    </>
  );
};
export default MultiArticle;
