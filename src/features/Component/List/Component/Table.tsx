import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Skeleton,
  Steps,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { memo, ReactElement, useEffect, useState } from "react";
import { Table } from "antd";
import { selectData } from "../../../../store/store";

import { infoObj } from "../slice/slice";
import style from "../style.module.scss";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import CreateForm from "./CreateForm";
import Cookies from "js-cookie";
import { callApi } from "../../../../Api/Axios";
export interface TableProps {
  columns: any;
  typeOption?: Array<ReactElement>;
}
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}
const { Step } = Steps;

const TableItems = memo(({ typeOption, columns }: TableProps) => {
  const dataItem: infoObj | any = useAppSelector(selectData).infoArray;
  const actionApi = useAppSelector(selectData).actionApi;
  const pagination = useAppSelector(selectData).pagination;
  const locale = useAppSelector(selectData).locale;
  const storeState = useAppSelector(selectData).storeState;

  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [ID, setID] = useState<string | number>();
  const [modal, setModal] = useState<string>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    dataItem[dataItem.findIndex((obj) => obj.id === ID)]
      ? setData(dataItem[dataItem.findIndex((obj) => obj.id === ID)])
      : setData(dataItem[dataItem.findIndex((obj) => obj.name === ID)]);
  }, [ID, dataItem]);

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
        <Form key={uuid()} onFinish={addRow} layout="inline">
          {!actionApi?.includes("system") ? (
            <Form.Item
              label="Tiêu đề thông tin"
              rules={[
                { required: true, message: "Không được bỏ trống trường này!" },
              ]}
              name="title"
            >
              <Input type="text" />
            </Form.Item>
          ) : (
            false
          )}

          {actionApi === "v1/page" ? (
            <Form.Item
              label="Định danh "
              rules={[
                { required: true, message: "Không được bỏ trống trường này!" },
              ]}
              name="name"
            >
              <Input type="text" />
            </Form.Item>
          ) : (
            false
          )}
          {actionApi?.includes("system") ? (
            <div>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                key={uuid()}
                label="Tên tài khoản"
                name="username"
              >
                <Input placeholder={"Tên tài khoản"} />
              </Form.Item>
              <Form.Item key={uuid()} label="Họ và tên">
                <div className="d-flex">
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Không được bỏ trống trường này!",
                      },
                    ]}
                    name={"firstname"}
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={"Họ"} />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Không được bỏ trống trường này!",
                      },
                    ]}
                    name="lastname"
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={"Tên"} />
                  </Form.Item>
                </div>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"email"}
                label="Email"
              >
                <Input placeholder={"Email"}></Input>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"content"}
                label="Số điện thoại"
              >
                <Input placeholder={"Số điện thoại"}></Input>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"password"}
                label="Mật khẩu"
              >
                <Input placeholder={"Mật khẩu"}></Input>
              </Form.Item>
              <Form.Item key={uuid()} name={"role"} label={"Nhóm quyền"}>
                <Select placeholder={"Chọn Nhóm quyền"} loading={!typeOption}>
                  {typeOption}
                </Select>
              </Form.Item>
            </div>
          ) : (
            false
          )}

          <Form.Item>
            <Button htmlType="submit" type="primary">
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
          typeOption={typeOption}
          data={dataItem[0]}
        />
      ),
    },
  ];
  return (
    <>
      <div className={clsx(style.wraper, "d-flex")}>
        <div className={clsx(style.function, "d-flex")}>
          <Button
            onClick={() => {
              setModal("create");
              setIsModalOpen(true);
            }}
            type="primary"
          >
            Thêm thông tin
          </Button>
        </div>
        {storeState !== "loading" ? (
          <Table
            className={clsx(style.table)}
            pagination={false}
            columns={[
              ...columns,
              {
                title: "Chức Năng",
                key: "action",
                fixed: "right",
                render: (_, record) => (
                  <div key={uuid()}>
                    <Popconfirm
                      onConfirm={() => {
                        dispatch({
                          type: "DELETE_REQUESTED",
                          payload: {
                            id: record.id ? record.id : record.name,
                            name: record?.name,
                            action: actionApi,
                          },
                        });
                      }}
                      title="Bạn muốn xóa thông tin này ?"
                      okText="Xóa"
                      cancelText="Hủy"
                    >
                      <Button size="small" key={uuid()}>
                        Xóa
                      </Button>
                    </Popconfirm>

                    <Button
                      size="small"
                      onClick={() => {
                        dispatch({
                          type: "GET_ROW_REQUESTED",
                          payload: {
                            ID: { id: record.id, name: record.name },
                            action: actionApi,
                            locale,
                          },
                        });
                        setID(record.id ? record.id : record.name);
                        setModal("fix");
                        setIsModalOpen(true);
                      }}
                      key={uuid()}
                    >
                      Sửa
                    </Button>
                  </div>
                ),
              },
            ]}
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
        width="70vw"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrent(0);
        }}
        footer={false}
        title={"Thêm thông tin"}
      >
        {modal === "create" ? (
          <>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title}></Step>
              ))}
            </Steps>
            <div className={clsx(style.stepsContent)}>
              {steps[current].content}
            </div>
          </>
        ) : (
          false
        )}
        {modal === "fix" ? (
          <CreateForm
            data={data}
            typeOption={typeOption}
            id={ID}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          false
        )}
      </Modal>
    </>
  );
});
export default TableItems;
