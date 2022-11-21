import { Button, Form, Input } from "antd";
import React from "react";
import clsx from "clsx";
import style from "../style.module.scss";

import { userInfoSelector } from "../../Login/slice/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

export interface ChangePassProps {}

export function ChangePass(props: ChangePassProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const storeState = useAppSelector(userInfoSelector).storeState;

  const onFinish = (value: any) => {
    dispatch({ type: "USER_CHANGE_PASS_REQUESTED", payload: value });
  };
  return (
    <div className={clsx(style.form)}>
      <Form
        autoComplete='none'
        form={form}
        onFinish={onFinish}
        layout='vertical'
      >
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
            () => ({
              validator(_, value) {
                if (value.length > 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu phải có nhiều hơn 6 ký tự")
                );
              },
              message: "Mật khẩu phải có nhiều hơn 6 ký tự",
            }),
          ]}
          name='current_password'
          label='Mật khẩu hiện tại'
        >
          <Input type='text' />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
            () => ({
              validator(_, value) {
                if (value.length > 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu phải có nhiều hơn 6 ký tự")
                );
              },
              message: "Mật khẩu phải có nhiều hơn 6 ký tự",
            }),
          ]}
          name='new_password'
          hasFeedback
          label='Mật khẩu mới'
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          style={{ margin: "10px" }}
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu mới và mật khẩu xác nhận phải giống nhau")
                );
              },
              message: "Mật khẩu mới và mật khẩu xác nhận phải giống nhau",
            }),
            () => ({
              validator(_, value) {
                if (value.length > 6) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu phải có nhiều hơn 6 ký tự")
                );
              },
              message: "Mật khẩu phải có nhiều hơn 6 ký tự",
            }),
          ]}
          name='confirm_password'
          hasFeedback
          label='Nhập lại mật khẩu'
        >
          <Input.Password />
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
