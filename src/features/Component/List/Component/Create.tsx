import { Button, Form, Input, Select, Steps } from "antd";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectData } from "../../../../store/store";
import CreateForm from "./Form";
import { v4 as uuid } from "uuid";
import clsx from "clsx";
import style from "../style.module.scss";
import { infoObj } from "../slice/slice";
import openNotificationWithIcon from "../../../function/toast";
import SelectCategory from "./Select";

const { Step } = Steps;
function useIsMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return () => isMounted.current;
}
export interface CreateProps {
  typeOption?: Array<ReactElement>;
  setIsModalOpen: Function;
  modal: boolean;
}

const Create = ({ typeOption, setIsModalOpen, modal }: CreateProps) => {
  const actionApi = useAppSelector(selectData).actionApi;
  const storeState = useAppSelector(selectData).storeState;
  const errorMessage = useAppSelector(selectData).errorMessage;

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(0);
  const dataItem: infoObj | any = useAppSelector(selectData).infoArray;

  useEffect(() => {
    return () => {
      setCurrent(0);
      dispatch({ type: "SET-IDLE" });
    };
  }, []);

  useEffect(() => {
    if (storeState === "success") {
      setCurrent(1);
    }
    if (storeState === "error") {
      if (errorMessage.message) {
        openNotificationWithIcon(
          "error",
          "Tạo tài khoản không thành công",
          errorMessage.message
        );
      }
      form.setFields(
        Object?.keys(errorMessage).map((key) => ({
          name: key,
          errors: [errorMessage[key]],
        }))
      );
    }
  }, [storeState]);
  const addRow = async (title) => {
    dispatch({
      type: "ADD_ROW_REQUESTED",
      payload: {
        title,
        action: actionApi,
      },
    });

    // const test = await storeState;
    // console.log(test);
    // setCurrent(1);
  };
  const steps = [
    {
      title: "Tạo tiêu đề thông tin",
      content: (
        <Form form={form} key={uuid()} onFinish={addRow} layout='inline'>
          {!actionApi?.includes("system") && !actionApi?.includes("city") ? (
            <Form.Item
              label='Tiêu đề thông tin'
              rules={[
                {
                  required: true,
                  message: "Không được bỏ trống trường này!",
                },
              ]}
              name='title'
            >
              <Input type='text' />
            </Form.Item>
          ) : (
            false
          )}

          {actionApi === "v1/page" || actionApi?.includes("city/role") ? (
            <Form.Item
              label='Định danh '
              rules={[
                {
                  required: true,
                  message: "Không được bỏ trống trường này!",
                },
              ]}
              name='name'
            >
              <Input type='text' />
            </Form.Item>
          ) : (
            false
          )}
          {actionApi?.includes("system/city") ||
          actionApi?.includes("city/user") ? (
            <div>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                key={uuid()}
                label='Tên tài khoản'
                name='username'
              >
                <Input placeholder={"Tên tài khoản"} />
              </Form.Item>
              <Form.Item key={uuid()} label='Họ và tên'>
                <div className='d-flex'>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Không được bỏ trống trường này!",
                      },
                    ]}
                    name={"firstname"}
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={"Họ"} />
                  </Form.Item>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Không được bỏ trống trường này!",
                      },
                    ]}
                    name='lastname'
                    style={{
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                    }}
                  >
                    <Input placeholder={"Tên"} />
                  </Form.Item>
                </div>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"email"}
                label='Email'
              >
                <Input placeholder={"Email"}></Input>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"phone"}
                label='Số điện thoại'
              >
                <Input type='number' placeholder={"Số điện thoại"}></Input>
              </Form.Item>
              <Form.Item
                key={uuid()}
                rules={[
                  {
                    required: true,
                    message: "Không được bỏ trống trường này!",
                  },
                ]}
                name={"password"}
                label='Mật khẩu'
              >
                <Input placeholder={"Mật khẩu"}></Input>
              </Form.Item>
              {!actionApi?.includes("system/city") ? (
                <SelectCategory
                  Url={`/v1/city/role/gets?limit=1000&page=1&search=`}
                  name='role'
                  label='Chọn nhóm quyền'
                  locale={"vi"}
                  mode={undefined}
                ></SelectCategory>
              ) : (
                false
              )}

              <Form.Item>
                <Button htmlType='submit' type='primary'>
                  Xác Nhận
                </Button>
              </Form.Item>
            </div>
          ) : (
            false
          )}
          {!actionApi?.includes("system/city") &&
          !actionApi?.includes("city/user") ? (
            <Form.Item>
              <Button htmlType='submit' type='primary'>
                Xác Nhận
              </Button>
            </Form.Item>
          ) : (
            false
          )}
        </Form>
      ),
    },
    {
      title: "Chỉnh sửa nội dung thông tin",
      content: (
        <CreateForm
          // setCurrent={setCurrent}
          setIsModalOpen={setIsModalOpen}
          key={uuid()}
          data={dataItem[0]}
        />
      ),
    },
  ];

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title}></Step>
        ))}
      </Steps>
      <div className={clsx(style.stepsContent)}>{steps[current].content}</div>
    </>
  );
};
export default Create;
