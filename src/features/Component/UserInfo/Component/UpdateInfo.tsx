import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import clsx from "clsx";
import style from "../style.module.scss";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { userInfoSelector } from "../../Login/slice/UserSlice";

export interface UpdateInfoProps {}

export function UpdateInfo(props: UpdateInfoProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const userInfo = useAppSelector(userInfoSelector).info;

  const onFinish = (value: any) => {
    dispatch({ type: "USER_UPDATE_INFO_REQUESTED", payload: value });
  };
  useEffect(() => {
    form.setFieldsValue(userInfo);
  }, []);
  return (
    <div className={clsx(style.form)}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name='firstname'
          label='Họ'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name='lastname'
          label='Tên'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name='email'
          label='Email'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
          ]}
          name='phone'
          label='Số điện thoại'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item style={{ margin: "10px" }}>
          <Button htmlType='submit' type='primary'>
            Xác Nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
