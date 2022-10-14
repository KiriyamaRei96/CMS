import { Button, Form, Input, Modal, Pagination, Skeleton, Steps } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { memo, useEffect, useState } from "react";
import { Table } from "antd";
import { selectData } from "../../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { infoObj } from "../../../slice/slice";
import style from "../style.module.scss";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
export interface TableProps {
  columns: any;
}
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const { Step } = Steps;

const TableItems = memo(({ columns }: TableProps) => {
  const dataItem: infoObj | any = useSelector(selectData).infoArray;
  const actionApi = useSelector(selectData).actionApi;
  const storeSate = useSelector(selectData).storeState;
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const addRow = (title) => {
    dispatch({
      type: "ADD_ROW_REQUESTED",
      payload: {
        title,
        action: actionApi,
      },
    });
    setCurrent(1);
  };

  const steps = [
    {
      title: "Tạo tiêu đề thông tin",
      content: (
        <Form onFinish={addRow} layout='inline'>
          <Form.Item
            label='Tiêu đề thông tin'
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name='title'
          >
            <Input type='text' />
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary'>
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Chỉnh sửa nội dung thông tin",
      content: (
        <>
          {storeSate === "loading" ? (
            <Skeleton active />
          ) : (
            <div>
              <span>{dataItem[0].title}</span>
            </div>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <div className={clsx(style.wraper, "d-flex")}>
        <div className={clsx(style.function, "d-flex")}>
          <Button onClick={() => setIsModalOpen(true)} type='primary'>
            Thêm thông tin
          </Button>
        </div>

        <Table
          className={clsx(style.table)}
          pagination={false}
          columns={columns}
          dataSource={dataItem}
          rowKey={uuid()}
        />
        <Pagination
          showSizeChanger
          // onShowSizeChange={onShowSizeChange}
          defaultCurrent={1}
          total={500}
        />
      </div>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        title={"Thêm thông tin"}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title}></Step>
          ))}
        </Steps>
        <div className={clsx(style.stepsContent)}>{steps[current].content}</div>
      </Modal>
    </>
  );
});
export default TableItems;
