import { Button, Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import style from "../style.module.scss";
import clsx from "clsx";
const ChangePassForm = ({ setField }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Thay đổi mật khẩu
      </Button>
      <Modal
        width='70vw'
        destroyOnClose
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        title={"Thay đổi mật khẩu "}
      >
        <Form
          onFinish={(value) => {
            setField("password", value.password);
            setIsModalOpen(false);
          }}
          className={clsx(style.form)}
        >
          <Form.Item
            className={clsx(style.formItem)}
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
            label='Mật khẩu'
            name='password'
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className={clsx(style.formItem)}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Mật khẩu mới và mật khẩu xác nhận phải giống nhau"
                    )
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
            label='Nhập lại mật khẩu'
            hasFeedback
            name='confirm_password'
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              className={clsx(style.submit)}
              htmlType='submit'
              type='primary'
            >
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ChangePassForm;
