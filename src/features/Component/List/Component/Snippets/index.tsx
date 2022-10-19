import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Steps,
} from "antd";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import style from "../../style.module.scss";
import { useAppSelector } from "../../../../../app/hooks";
import { selectData } from "../../../../../app/store";

import typeMap from "./typeMap";
import { callApi } from "../../../../../Api/Axios";
import Cookies from "js-cookie";
export interface SnippetsProps {
  data: [any];
  pageName: string | number;
}
const { Step } = Steps;

const Snippets = ({ data, pageName }: SnippetsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snipArr, setSnipArr] = useState<any>();
  const [current, setCurrent] = useState(0);
  console.log(pageName);
  const snippetMap = {
    SnippetGalleries: "Khối hình ảnh",
    SnippetObject: "Khối bài viết",
  };
  const steps = [
    {
      title: "Chọn kiểu khối và đặt tên khối dữ liệu ",
      content: (
        <Form onFinish={() => {}} labelCol={{ span: 4 }}>
          <Form.Item
            label="Tên Khối dữ liệu"
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name="snippet_name"
          >
            <Input placeholder="Tên Khối dữ liệu" type="text" />
          </Form.Item>
          <Form.Item
            label="Chọn kiểu khối"
            rules={[
              { required: true, message: "Không được bỏ trống trường này!" },
            ]}
            name="key"
          >
            <Select placeholder="Chọn kiểu khối">
              {snipArr?.map((snip) => (
                <Select.Option value={snippetMap[snip.key]}>{}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Xác Nhận
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Cập nhật dữ liệu cho khối ",
      content: "",
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
      <List
        bordered
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item className={clsx("d-flex", style.snippets)}>
            <span>Tên khối: {item["title"]}</span>

            <Row
              className={clsx("d-flex", style.snipContent)}
              gutter={[16, 16]}
            >
              {item?.relations.map((item) => (
                <Col span={8}>
                  <Card
                    title={item.title ? item.title : item.name}
                    bordered={true}
                    cover={
                      item.type === "image" ? (
                        <img
                          className={clsx(style.snipCover)}
                          alt="example"
                          src={item?.path}
                        />
                      ) : item.featureImage ? (
                        <img
                          className={clsx(style.snipCover)}
                          alt="example"
                          src={item?.featureImage.path}
                        />
                      ) : (
                        false
                      )
                    }
                  >
                    {item.type !== "image" ? (
                      <span>Loại nội dung: {typeMap[item.type]}</span>
                    ) : (
                      false
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </List.Item>
        )}
        footer={
          <Button
            onClick={() => setIsModalOpen(true)}
            className={clsx("d-flex", style.snipFooter)}
          >
            Tạo khối nội dung
          </Button>
        }
      ></List>
      <Modal
        width="70vw"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={false}
        title={"Tạo khối nội dung"}
      >
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title}></Step>
          ))}
        </Steps>
        <div className={clsx(style.stepsContent)}>{steps[current].content}</div>
      </Modal>
    </>
  );
};
export default Snippets;
