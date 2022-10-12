import React, { memo } from "react";
import style from "./style.module.scss";
import clsx from "clsx";
import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
export interface LoginProps {}

const Login = memo((props: LoginProps) => {
  //   document.cookie = "test=testText";
  // console.log([document.cookie]);
  const dispatch = useDispatch();
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
          labelCol={{ span: 5 }}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
});
export default Login;
