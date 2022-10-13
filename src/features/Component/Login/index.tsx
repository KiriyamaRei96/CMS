import React, { memo, useEffect } from "react";
import style from "./style.module.scss";
import clsx from "clsx";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userInfoSelector } from "./slice/UserSlice";
import { useNavigate } from "react-router-dom";
export interface LoginProps {}

const Login = memo((props: LoginProps) => {
  const loginState = useSelector(userInfoSelector).isLogin;
  const navigate = useNavigate();
  useEffect(() => {
    if (loginState || document.cookie !== "") {
      navigate("/");
    }
  }, [loginState]);
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
          labelCol={{ span: 6 }}
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: "vui lòng nhập tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Password'
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
