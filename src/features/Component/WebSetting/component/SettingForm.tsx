import { Button, Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import clsx from "clsx";
import style from "../style.module.scss";

import { v4 as uuid } from "uuid";

export interface SettingFromProps {
  data: any | undefined;
  setArr: Function;
  arr: Array<any> | Array<void>;
  setModalOpen: Function;
}

const SettingFrom = ({ arr, data, setArr, setModalOpen }: SettingFromProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        if (data[key] === "") {
          delete data[key];
        }
      });
      form.setFieldsValue(data);
    }
  }, [data]);
  return (
    <Form
      onFinish={(value) => {
        const outPut = {
          ...value,
        };

        if (!data) {
          outPut.id = uuid();

          if (arr) {
            console.log(outPut);
            setArr("fields", [outPut, ...arr]);
          }
          if (!arr) {
            setArr("fields", [outPut]);
          }
        }
        if (data) {
          outPut.id = data.id;
          setArr(
            "fields",
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
      layout='inline'
    >
      <div className={clsx(style.titleWraper, "d-flex flex-wrap")}>
        <Form.Item name='name' label='Định danh' className={"formAvatar"}>
          {data?.name ? <span>{data?.name}</span> : <Input />}
        </Form.Item>

        <Form.Item
          name='fieldType'
          label='Loại thông tin'
          className={"formAvatar"}
        >
          <Select placeholder='Loại thông tin'>
            <Select.Option value={"title"}>Tiêu đề</Select.Option>
            <Select.Option value={"content"}>Nội dung</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='text' label='Nội dung' className={"formAvatar"}>
          <Input />
        </Form.Item>
        <Form.Item name='link' label='Link' className={"formAvatar"}>
          <Input />
        </Form.Item>
      </div>

      <Form.Item className={clsx(style.submit)}>
        <Button htmlType='submit' type='primary'>
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default SettingFrom;
