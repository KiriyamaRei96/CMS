import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../../../style.module.scss";
import { Avatar, Button, Form, Input, Popconfirm, Table } from "antd";
import { v4 as uuid } from "uuid";

export interface MultiArticleProps {
  data: Array<object | void>;
}

const MultiArticle = ({ data }: MultiArticleProps) => {
  const [arr, setArr] = useState<any>(data);
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
            onConfirm={() => {}}
            title="Bạn muốn xóa thông tin này ?"
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small">Xóa</Button>
          </Popconfirm>
          <Button size="small" onClick={() => {}}>
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
      <Form.Item
        className={clsx(style.formItem)}
        key={uuid()}
        label={"Danh sách nội dung"}
        name={"articles"}
      >
        <Table
          columns={collumns}
          dataSource={arr}
          pagination={false}
          rowKey={uuid()}
        ></Table>
        <Button onClick={() => {}} className={clsx("d-flex", style.snipFooter)}>
          Tạo thông tin
        </Button>
      </Form.Item>
    </>
  );
};
export default MultiArticle;
