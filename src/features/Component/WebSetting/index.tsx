import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "./style.module.scss";
import { Button, Form, Popconfirm, Select, Table } from "antd";
import SnipAvatar from "../List/Component/Snippets/component/Avatar";
import { callApi } from "../../../Api/Axios";
import { useAppSelector } from "../../../store/hooks";
import { selectData } from "../../../store/store";
import { useDispatch } from "react-redux";

export interface WebSettingProps {}

const WebSetting = (props: WebSettingProps) => {
  const collums = [
    {
      title: "Định danh",
      dataIndex: "name",
      key: uuid(),
      render: (text) => <span>{text ? text : "chưa có thông tin"}</span>,
    },
    {
      title: "Phân loại thông tin",
      dataIndex: "fieldType",
      key: uuid(),
      render: (text) => <span>{text ? text : "chưa có thông tin"}</span>,
    },
    {
      title: "Nội dung",
      dataIndex: "text",
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
              form.setFieldValue(
                "articles",
                form
                  .getFieldValue("articles")
                  .filter((item) => item.id !== record.id)
              );
              //   setUpdate(uuid());
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
              //   setUpdate(record);
              //   setModalOpen(true);
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];
  const [form] = Form.useForm();
  const [locale, setLocate] = useState("vi");
  const localeArr = useAppSelector(selectData).localeArr;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "GET_SETTING_REQUESTED", payload: locale });
  }, []);
  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>Quản lý website</h3>
      </div>
      <div className={clsx(style.warpper)}>
        <Form className={clsx(style.form)} form={form} layout='inline'>
          <div className='d-flex'>
            <SnipAvatar
              name='logo'
              label='Thay đổi logo'
              data={form.getFieldValue("logo")}
            />
            <Form.Item
              className={clsx(style.formDes)}
              key={uuid()}
              name={"locale"}
              label={"Ngôn ngữ"}
            >
              <Select
                defaultValue={locale}
                onChange={(value) => {}}
                placeholder={"Chọn Ngôn ngữ"}
              >
                {Object.keys(localeArr).map((key) => {
                  return (
                    <Select.Option value={key}>
                      <img
                        className='icon'
                        src={localeArr[key].icon}
                        alt=''
                      ></img>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            className={clsx(style.formItem)}
            key={uuid()}
            label={"Danh sách nội dung"}
            name={"fields"}
          >
            <Table
              columns={collums}
              dataSource={form.getFieldValue("fields")}
              pagination={false}
              rowKey={uuid()}
            ></Table>
          </Form.Item>
          <Form.Item className={clsx(style.submit)}>
            <Button htmlType='submit' type='primary'>
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default WebSetting;
