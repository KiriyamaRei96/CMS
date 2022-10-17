import React, { memo, useEffect } from "react";
import style from "./style.module.scss";
import clsx from "clsx";
import { Button, Form, Input } from "antd";

import { userInfoSelector } from "./slice/UserSlice";
import { useNavigate } from "react-router-dom";
import getCookie from "../../../Api/getCookie";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
export interface LoginProps {}

const Login = memo((props: LoginProps) => {
  const loginState = useAppSelector(userInfoSelector).isLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (loginState && getCookie("token") !== undefined) {
      navigate("/");
    }
  }, [loginState]);
  const dispatch = useAppDispatch();
  const onFinish = (values: any) => {
    dispatch({ type: "USER_LOGIN_REQUESTED", payload: values });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={clsx(style.login, "d-flex")}>
      <div>
        <h1>CMS cổng thông tin điện tử </h1>
        <Form
          labelCol={{ span: 6 }}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Tên tài khoản'
            name='username'
            rules={[{ required: true, message: "vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='mật khẩu'
            name='password'
            rules={[{ required: true, message: "vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
export default Login;
