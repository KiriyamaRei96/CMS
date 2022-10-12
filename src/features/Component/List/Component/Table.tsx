import { Button, Pagination, Space, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { memo } from "react";
import { Table } from "antd";
import { selectData } from "../../../../app/store";
import { useSelector } from "react-redux";
import { InitSate } from "../../../slice/slice";
import style from "../style.module.scss";
import clsx from "clsx";
export interface TableProps {}
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <span>Invite {record.name}</span>
        <span>Delete</span>
      </Space>
    ),
  },
];
const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
const itemColum: ColumnsType<InitSate> = [
  {
    title: "Name",
    dataIndex: "Name",
    key: "name",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "describe",
    dataIndex: "des",
    key: "des",
  },
  {
    title: "Renting",
    dataIndex: "renting",
    key: "renting",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (_, { types }) => (
      <>
        {types?.map((type) => {
          let color = type.length > 5 ? "geekblue" : "green";

          return (
            <Tag color={color} key={type}>
              {type.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "ImgList",
    dataIndex: "imgList",
    key: "imgList",
    render: (_, { imgList }) => (
      <>
        {imgList?.map((obj) => {
          // console.log(obj.name);
          return (
            <img className={clsx(style.tableImg)} src={obj?.name} alt="" />
          );
        })}
      </>
    ),
  },
];
const TableItems = memo((props: TableProps) => {
  const dataItem: InitSate | any = useSelector(selectData);

  return (
    <div>
      <Button type="primary">Thêm thông tin</Button>

      <Table pagination={false} columns={itemColum} dataSource={dataItem} />
      <Pagination
        showSizeChanger
        // onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
      />
    </div>
  );
});
export default TableItems;
