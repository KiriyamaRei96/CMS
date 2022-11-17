import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Steps, Table } from "antd";
import { v4 as uuid } from "uuid";
import style from "../../style.module.scss";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { selectData } from "../../../../../store/store";
import { callApi } from "../../../../../Api/Axios";
import Cookies from "js-cookie";
import RoomForm from "./componet/RoomForm";
export interface RoomProps {
  id: string | number;
  data: Array<void> | Array<Object>;
}

const Room = ({ id, data }: RoomProps) => {
  const [inputData, setInputData] = useState<any>();
  const [current, setCurrent] = useState<number>(0);
  const [fixModal, setFixModal] = useState<boolean>(false);
  const [formdata, setFormData] = useState<any>();
  const { Step } = Steps;
  const [createModal, setCreateModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const locale = useAppSelector(selectData).locale;

  useEffect(() => {
    setInputData(data);
  }, [data]);
  const collums = [
    {
      title: "Tiêu đề phòng",
      dataIndex: "title",
      key: uuid(),
      render: (text) => <span>{text ? text : "Chưa có thông tiêu đề"}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: uuid(),
      render: (text) => <span>{text ? text : "Chưa có thông tin"}</span>,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            onConfirm={() => {
              dispatch({
                type: "DELETE_REQUESTED",
                payload: {
                  id: record.id ? record.id : record.name,
                  name: record?.name,
                  action: "/v1/room",
                },
              });
              setInputData((prv) =>
                prv.filter((item) => item.id !== record.id)
              );
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
              setFormData(inputData?.find((item) => item.id === record.id));
              setFixModal(true);
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];
  const steps = [
    {
      title: "Đặt tiêu đề cho phòng",
      content: (
        <Form
          onFinish={async (value) => {
            const res = await callApi
              .post(
                "/v1/room/create",
                {
                  ...value,
                  hotel: id,
                  locale: locale,
                },
                {
                  headers: {
                    Authorization: Cookies.get("token"),
                  },
                }
              )
              .then((res) => res.data)
              .catch((err) => console.log(err));
            if (res.status === 1) {
              setInputData((prv) => [res.data, ...prv]);
              setFormData(res.data);
              setCurrent(1);
            }
            if (res.status === 0) {
              console.log(res);
            }
          }}
        >
          <Form.Item
            label='Tiêu đề phòng'
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name='title'
          >
            <Input></Input>
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
      title: "Sửa thông tin phòng",
      content: (
        <RoomForm
          setInputData={setInputData}
          id={id}
          closeModal={setCreateModal}
          data={formdata}
        />
      ),
    },
  ];
  return (
    <Form.Item
      className={clsx(style.formItem)}
      key={"rooms"}
      label='Thông tin phòng '
      name='room'
    >
      <Table
        rowKey={uuid()}
        columns={collums}
        dataSource={inputData}
        pagination={false}
      ></Table>
      <Button
        onClick={() => {
          setCurrent(0);
          setCreateModal(true);
        }}
        className={clsx("d-flex", style.snipFooter)}
      >
        Tạo phòng
      </Button>
      <Modal
        destroyOnClose
        width='70vw'
        open={createModal}
        onCancel={() => {
          setCreateModal(false);
        }}
        footer={false}
        title={"Tạo phòng"}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title}></Step>
          ))}
        </Steps>
        <div className={clsx(style.stepsContent)}>{steps[current].content}</div>
      </Modal>
      <Modal
        destroyOnClose
        width='70vw'
        open={fixModal}
        onCancel={() => {
          setFixModal(false);
        }}
        footer={false}
        title={"Sửa thông tin phòng"}
      >
        <RoomForm
          id={id}
          setInputData={setInputData}
          closeModal={setFixModal}
          data={formdata}
        />
      </Modal>
    </Form.Item>
  );
};
export default Room;
