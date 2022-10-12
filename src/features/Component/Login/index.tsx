import React, { memo } from "react";
import style from "./style.module.scss";
import clsx from "clsx";
import { Button, Checkbox, Form, Input } from "antd";
export interface LoginProps {}

const Login = memo((props: LoginProps) => {
  //   document.cookie = "test=testText";
  console.log([document.cookie]);
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={clsx(style.login, "d-flex")}>
      <div>
        <h1>CMS cổng thông tin điện tử </h1>
        <Form
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: "Please input your password!" }]}
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
