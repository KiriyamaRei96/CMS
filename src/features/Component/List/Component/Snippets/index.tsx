import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Steps,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../../style.module.scss";

import { v4 as uuid } from "uuid";
import { callApi } from "../../../../../Api/Axios";
import Cookies from "js-cookie";
import openNotificationWithIcon from "../../../../function/toast";
import SnippetsForm from "./SnippetForm";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { selectData } from "../../../../../store/store";

export interface SnippetsProps {
  data: [any];
  pageName: String | number;
}
const { Step } = Steps;

const Snippets = ({ data, pageName }: SnippetsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snipArr, setSnipArr] = useState<any>();
  const [snippets, setSnippets] = useState<any>();

  const [current, setCurrent] = useState<any>(false);
  const dispatch = useAppDispatch();

  const actionApi = useAppSelector(selectData).actionApi;
  const locale = useAppSelector(selectData).locale;

  const snippetMap = {
    SnippetGalleries: "Khối hình ảnh",
    SnippetObject: "Khối bài viết",
  };

  const collums = [
    {
      title: "Tên Khối nội dung",
      dataIndex: "snippet_name",
      key: uuid(),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tiêu đề Khối nội dung",
      dataIndex: "title",
      key: uuid(),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Loại khối nội dung",
      dataIndex: "key",
      key: uuid(),
      render: (text) => <span>{snippetMap[text]}</span>,
    },
    {
      title: "Số lượng Thông tin trong khối",
      dataIndex: "relations",
      key: uuid(),
      render: (text) => <span>{text.length}</span>,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            onConfirm={() => {
              dispatch({
                type: "DELETE_SNIPPETS_REQUESTED",
                payload: {
                  data: {
                    snippet_name: record["snippet_name"],

                    page_name: pageName,
                  },
                  actionApi,
                  name: pageName,
                  locale,
                },
              });
            }}
            title='Bạn muốn xóa thông tin này ?'
            okText='Xóa'
            cancelText='Hủy'
          >
            <Button size='small'>Xóa</Button>
          </Popconfirm>
          <Button
            size='small'
            onClick={() => {
              setSnippets({
                key: record.key,
                data: record.relations,
                title: record.title,
                name: record["snippet_name"],
                pageName,
              });
              setCurrent(false);
              setIsModalOpen(true);
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];
  const steps = [
    {
      title: "Chọn kiểu khối và đặt tên khối dữ liệu ",
      content: (
        <Form
          onFinish={async (value) => {
            value["page_name"] = pageName;
            const cookie = Cookies.get("token");
            const res = await callApi({
              method: "POST",
              url: "v1/snippet/create",
              headers: { Authorization: cookie },
              data: value,
            })
              .then((res) => res.data)
              .catch((err) => console.log(err));

            if (res.status === 1) {
              setSnippets({
                key: value.key,
                pageName,
                name: value["snippet_name"],
              });
              setCurrent(1);
            }
            if (res.status === 0) {
              openNotificationWithIcon(
                "error",
                "Tạo khối dữ thông tin không thành công",
                "Vui lòng kiểm tra lại tên khối, tên khối không được có khoảng trắng hoặc đã từng tồn tại"
              );
            }
          }}
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label='Tên Khối dữ liệu'
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name='snippet_name'
          >
            <Input placeholder='Tên Khối dữ liệu' type='text' />
          </Form.Item>
          <Form.Item
            label='Chọn kiểu khối'
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name='key'
          >
            <Select placeholder='Chọn kiểu khối'>
              {snipArr?.map((snip) => (
                <Select.Option value={snip.key}>
                  {snippetMap[snip.key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit' type='primary'>
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Cập nhật dữ liệu cho khối ",
      content: (
        <SnippetsForm
          setIsModalOpen={setIsModalOpen}
          setCurrent={setCurrent}
          snippets={snippets}
        />
      ),
    },
  ];

  useEffect(() => {
    const cookie = Cookies.get("token");
    if (!snipArr) {
      (async () => {
        const res = await callApi
          .get("v1/snippet/gets?limit=10&page=1&locale=vi", {
            headers: { Authorization: cookie },
          })
          .then((response) => response.data)
          .catch((error) => console.log(error));
        if (res.status === 1) {
          setSnipArr(res.data);
        }
      })();
    }
  }, []);

  return (
    <>
      <Table
        rowKey={uuid()}
        columns={collums}
        dataSource={data}
        pagination={false}
      ></Table>
      <Button
        onClick={() => {
          setCurrent(0);
          setIsModalOpen(true);
        }}
        className={clsx("d-flex", style.snipFooter)}
      >
        Tạo khối nội dung
      </Button>
      <Modal
        width='70vw'
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        title={"Tạo khối nội dung"}
      >
        {typeof current === "number" ? (
          <>
            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title}></Step>
              ))}
            </Steps>
            <div className={clsx(style.stepsContent)}>
              {steps[current].content}
            </div>
          </>
        ) : (
          <SnippetsForm
            setIsModalOpen={setIsModalOpen}
            setCurrent={setCurrent}
            snippets={snippets}
          />
        )}
      </Modal>
    </>
  );
};
export default Snippets;
