import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { v4 as uuid } from "uuid";
import style from "../../../style.module.scss";
import { titleMap } from "../../../titleMap";
import { callApi } from "../../../../../../Api/Axios";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
import { selectData } from "../../../../../../store/store";
import ReactQuill from "react-quill";
import Galleries from "../../Galleries";
export interface RoomFormProps {
  data?: any;
  id: number | string;
  closeModal: Function;
  setInputData: Function;
}

const RoomForm = ({ data, id, closeModal, setInputData }: RoomFormProps) => {
  const [form] = Form.useForm();
  const locale = useAppSelector(selectData).locale;
  const [error, setError] = useState<any>();
  const actionApi = useAppSelector(selectData).actionApi;
  const dispatch = useAppDispatch();

  useEffect(() => {
    form.setFieldsValue(data);
    if (error) {
      form.setFields(
        Object?.keys(error).map((key) => ({
          name: key,
          errors: [error[key]],
        }))
      );
    }
  }, [data, error]);
  return (
    <Form
      onFinish={async (value) => {
        const output = { ...data, ...value };

        if (value?.galleries) {
          output.galleries = value?.galleries?.fileList
            ? value?.galleries?.fileList
                ?.map((item: any) => {
                  if (item.id !== undefined) {
                    return item.id;
                  } else {
                    return item?.response?.data.id;
                  }
                })
                .toString()
            : value?.galleries
                ?.map((item: any) => {
                  if (item.id !== undefined) {
                    return item.id;
                  } else {
                    return item?.response?.data.id;
                  }
                })
                .toString();
        }

        output.locale = locale;
        const res = await callApi
          .put("/v1/room/update", output, {
            headers: { Authorization: Cookies.get("token") },
          })
          .then((res) => res.data)
          .catch((err) => console.log(err));
        if (res.status === 1) {
          const test = {
            ...data,
            ...value,
          };
          test.galleries = test?.galleries?.fileList?.map((item) =>
            item.response ? item.response.data : item
          );

          setInputData((prv) =>
            prv.map((item) => (item.id === test.id ? (item = test) : item))
          );
          closeModal(false);
        }
        if (res.status === 0) {
          setError(res.errors ? res.errors : res.error);
        }
      }}
      layout='inline'
      form={form}
      className={clsx(style.form)}
    >
      <div className='d-flex flex-wrap'>
        <Form.Item key={uuid()} label={"id"}>
          <span key={uuid()}>{data.id}</span>
        </Form.Item>
        <Form.Item key={uuid()} name={"published"} label={titleMap.published}>
          <Checkbox
            key={uuid()}
            defaultChecked={data.published}
            onChange={(e) => {
              callApi("/v1/room" + "/published", {
                method: "PUT",
                headers: { Authorization: Cookies.get("token") },
                data: {
                  id: data.id,
                  published: e.target.checked ? 1 : 0,
                  name: data.name,
                },
              });
            }}
          ></Checkbox>
        </Form.Item>
      </div>
      <div className={clsx(style.titleWraper, "d-flex")}>
        <Form.Item
          className={clsx(style.formDes)}
          key={uuid()}
          label={"Tiêu đề"}
          name={"title"}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          className={clsx(style.formDes)}
          key={uuid()}
          name={"price"}
          label='Giá cả'
        >
          <Input placeholder={data?.price}></Input>
        </Form.Item>
      </div>
      <Galleries galleri={data.galleries} />
      <Form.Item
        className={clsx(style.formItem)}
        key={uuid()}
        label='Nội dung'
        name='content'
      >
        <ReactQuill theme='snow' className={clsx(style.quill)}></ReactQuill>
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' type='primary'>
          Xác Nhận
        </Button>
      </Form.Item>
    </Form>
  );
};
export default RoomForm;
