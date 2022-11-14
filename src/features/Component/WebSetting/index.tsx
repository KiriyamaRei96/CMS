import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "./style.module.scss";
import { Button, Form, Modal, Popconfirm, Select, Table } from "antd";
import SnipAvatar from "../List/Component/Snippets/component/Avatar";
import { callApi } from "../../../Api/Axios";
import { useAppSelector } from "../../../store/hooks";
import { selectData } from "../../../store/store";
import { useDispatch } from "react-redux";
import { settingSelector } from "./slice/slice";
import SettingFrom from "./component/SettingForm";

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
                "fields",
                form
                  .getFieldValue("fields")
                  .filter((item) => item.id !== record.id)
              );
              setUpdate(uuid());
            }}
            title="Bạn muốn xóa thông tin này ?"
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button size="small">Xóa</Button>
          </Popconfirm>
          <Button
            size="small"
            onClick={() => {
              setUpdate(record);
              setModalOpen(true);
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
  const data = useAppSelector(settingSelector).data;
  const [modalOpen, setModalOpen] = useState<any>();
  const [update, setUpdate] = useState<any>();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "GET_SETTING_REQUESTED", payload: locale });
  }, [locale]);
  useEffect(() => {
    setUpdate(uuid());
    form.setFieldsValue({
      ...data,
      fields: data?.fields?.map((item) => ({
        ...item,
        id: uuid(),
      })),
    });
  }, [data.fields]);

  return (
    <div className={clsx("content", "d-flex")}>
      <div className={clsx(style.header)}>
        <h3>Quản lý website</h3>
      </div>
      <div className={clsx(style.warpper)}>
        <Form
          onFinish={(value) => {
            value?.logo?.file?.response?.data?.id
              ? (value.logo = value?.logo?.file?.response?.data?.id)
              : (value.logo = data.logo?.id);
            dispatch({ type: "UPDATE_SETTING_REQUESTED", payload: value });
          }}
          className={clsx(style.form)}
          form={form}
          layout="inline"
        >
          <div className="d-flex">
            <SnipAvatar
              name="logo"
              label="Thay đổi logo"
              data={form.getFieldValue("logo")}
            />
            <Form.Item
              className={clsx(style.formDes)}
              key={uuid()}
              name={"locale"}
              label={"Ngôn ngữ"}
              initialValue={locale}
            >
              <Select
                onChange={(value) => {
                  setLocate(value);
                }}
                placeholder={"Chọn Ngôn ngữ"}
              >
                {Object.keys(localeArr).map((key) => {
                  return (
                    <Select.Option value={key}>
                      <img
                        className="icon"
                        src={localeArr[key].icon}
                        alt=""
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
            <Button
              onClick={() => {
                setUpdate(undefined);
                setModalOpen(true);
              }}
              className={clsx("d-flex", style.snipFooter)}
            >
              Tạo thông tin
            </Button>
          </Form.Item>
          <Form.Item className={clsx(style.submit)}>
            <Button htmlType="submit" type="primary">
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        destroyOnClose
        width="70vw"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={false}
        title={"Thông Tin"}
      >
        <SettingFrom
          setModalOpen={setModalOpen}
          setArr={form.setFieldValue}
          arr={form.getFieldValue("fields")}
          data={update}
        ></SettingFrom>
      </Modal>
    </div>
  );
};
export default WebSetting;
