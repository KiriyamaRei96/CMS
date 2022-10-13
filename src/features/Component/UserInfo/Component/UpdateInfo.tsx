import { Button, Form, Input } from "antd";
import React, { memo } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { useDispatch } from "react-redux";

export interface UpdateInfoProps {}

export function UpdateInfo(props: UpdateInfoProps) {
  const dispatch = useDispatch();
  const onFinish = (value: any) => {
    console.log(value);
    dispatch({ type: "USER_UPDATE_INFO_REQUESTED", payload: value });
  };
  return (
    <div className={clsx(style.form)}>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name="firstname"
          label="Họ"
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name="lastname"
          label="Tên"
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name="email"
          label="Email"
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name="phone"
          label="Số điện thoại"
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item style={{ margin: "10px" }}>
          <Button htmlType="submit" type="primary">
            Xác Nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
