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
  }, [userInfo]);

  return (
    <div className={clsx(style.form)}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item
          style={{ margin: "10px" }}
          rules={[
            { required: true, message: "Không được bỏ trống trường này!" },
            () => ({
              validator(_, value) {
                if (value.length > 1) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Họ phải nhiều hơn 1 ký tự"));
              },
              message: "Họ phải nhiều hơn 1 ký tự",
            }),
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
            () => ({
              validator(_, value) {
                if (value.length > 1) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Tên phải nhiều hơn 1 ký tự"));
              },
              message: "Tên phải nhiều hơn 1 ký tự",
            }),
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
            () => ({
              validator(_, value) {
                if (
                  value.match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  )
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Sai định dạng email"));
              },
              message: "Sai định dạng email",
            }),
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
            () => ({
              validator(_, value) {
                if (
                  /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(value) &&
                  value.length >= 10 &&
                  value.length < 12
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Sai định dạng số điện thoại"));
              },
              message: "Sai định dạng số điện thoại",
            }),
          ]}
          name='phone'
          label='Số điện thoại'
        >
          <Input type='number' />
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
