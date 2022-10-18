import { Button, Form, Input, Modal, Pagination, Skeleton, Steps } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { memo, useEffect, useState } from "react";
import { Table } from "antd";
import { selectData } from "../../../../app/store";

import { infoObj } from "../slice/slice";
import style from "../style.module.scss";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import CreateForm from "./CreateForm";
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
  const dataItem: infoObj | any = useAppSelector(selectData).infoArray;
  const actionApi = useAppSelector(selectData).actionApi;
  const pagination = useAppSelector(selectData).pagination;
  const locale = useAppSelector(selectData).locale;
  const storeState = useAppSelector(selectData).storeState;

  const dispatch = useAppDispatch();
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
        <Form key={uuid()} onFinish={addRow} layout='inline'>
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
        <CreateForm
          setCurrent={setCurrent}
          setIsModalOpen={setIsModalOpen}
          key={uuid()}
        />
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
        {storeState !== "loading" ? (
          <Table
            className={clsx(style.table)}
            pagination={false}
            columns={columns}
            dataSource={dataItem}
            rowKey={uuid()}
            scroll={{ x: "auto", y: "auto" }}
          />
        ) : (
          <Skeleton active />
        )}

        <Pagination
          showSizeChanger
          current={pagination?.current}
          onChange={(page, pageSize) => {
            dispatch({
              type: "SEARCH_ROW_REQUESTED",
              payload: {
                action: actionApi,
                limit: pageSize,
                page,
                search: "",
                locale,
              },
            });
          }}
          total={pagination?.totalCount}
        />
      </div>
      <Modal
        width='70vw'
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrent(0);
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
